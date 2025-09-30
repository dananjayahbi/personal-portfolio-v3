'use server';

import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, signOut } from "@/lib/auth/session";
import type { LoginState } from "./state";

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Enter a valid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(4, "Password must be at least 4 characters"),
});

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      status: 'error',
      message: 'Please fix the highlighted fields',
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return { status: 'error', message: 'Invalid credentials' };
  }

  const passwordValid = await verifyPassword(password, admin.passwordHash);
  if (!passwordValid) {
    return { status: 'error', message: 'Invalid credentials' };
  }

  await createSession(admin.id);
  redirect('/admin-dashboard');
}

export async function logoutAction() {
  await signOut();
  redirect('/admin-login');
}

