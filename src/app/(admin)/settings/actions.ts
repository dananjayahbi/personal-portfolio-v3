'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentAdmin, signOut } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

const profileSchema = z.object({
  name: z.string().trim().min(3, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  bio: z.string().trim().max(600, "Keep it under 600 characters").optional(),
  avatarUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .pipe(z.string().url("Enter a valid URL").optional()),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Enter your current password"),
    newPassword: z.string().min(10, "New password must be at least 10 characters"),
    confirmPassword: z.string().min(10, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords must match',
    path: ['confirmPassword'],
  });

type ProfileState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof profileSchema>, string>>;
};

export const initialProfileState: ProfileState = { status: 'idle' };

type PasswordState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof passwordSchema>, string>>;
};

export const initialPasswordState: PasswordState = { status: 'idle' };

export async function updateProfile(_: ProfileState, formData: FormData): Promise<ProfileState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin-login');
  }

  const parsed = profileSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    bio: formData.get('bio'),
    avatarUrl: formData.get('avatarUrl'),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    const errors: ProfileState['fieldErrors'] = {};
    for (const [key, value] of Object.entries(fieldErrors)) {
      if (value?.[0]) {
        (errors as Record<string, string>)[key] = value[0];
      }
    }
    return {
      status: 'error',
      message: 'Please fix the highlighted fields',
      fieldErrors: errors,
    };
  }

  const data = parsed.data;

  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      name: data.name,
      email: data.email,
      bio: data.bio ?? null,
      avatarUrl: data.avatarUrl ?? null,
    },
  });

  revalidatePath('/settings');
  revalidatePath('/client-dashboard-content');

  return {
    status: 'success',
    message: 'Profile updated successfully',
  };
}

export async function changePassword(_: PasswordState, formData: FormData): Promise<PasswordState> {
  const adminSession = await getCurrentAdmin();
  if (!adminSession) {
    redirect('/admin-login');
  }

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    const errors: PasswordState['fieldErrors'] = {};
    for (const [key, value] of Object.entries(fieldErrors)) {
      if (value?.[0]) {
        (errors as Record<string, string>)[key] = value[0];
      }
    }
    return {
      status: 'error',
      message: 'Password update failed. Please review the inputs.',
      fieldErrors: errors,
    };
  }

  const admin = await prisma.admin.findUnique({ where: { id: adminSession.id } });
  if (!admin) {
    redirect('/admin-login');
  }

  const valid = await verifyPassword(parsed.data.currentPassword, admin.passwordHash);
  if (!valid) {
    return {
      status: 'error',
      message: 'Current password is incorrect.',
      fieldErrors: { currentPassword: 'Incorrect current password' },
    };
  }

  const newHash = await hashPassword(parsed.data.newPassword);

  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: newHash },
  });

  // Force sign out of all sessions after password change.
  await prisma.adminSession.deleteMany({ where: { adminId: admin.id } });
  await signOut(admin.id);

  redirect('/admin-login?intent=password-updated');
}
