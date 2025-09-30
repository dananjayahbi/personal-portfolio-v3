'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";

const settingsSchema = z.object({
  contactEmail: z.string().trim().email("Enter a valid email"),
  contactPhone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  availability: z.string().trim().optional(),
  resumeUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .pipe(z.string().url("Enter a valid URL").optional()),
  socialLinks: z.string().trim().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  seoKeywords: z.string().trim().optional(),
  ogImage: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .pipe(z.string().url("Enter a valid URL").optional()),
  themeAccent: z.string().trim().optional(),
  themeMode: z.enum(['auto', 'light', 'dark']).default('auto'),
  footerNote: z.string().trim().optional(),
});

type SettingsState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof settingsSchema>, string>>;
};

export const initialSettingsState: SettingsState = { status: 'idle' };

function parseSocialLinks(value?: string | null) {
  if (!value) return [] as Array<{ platform: string; url: string }>;
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [platform, url] = line.split('|').map((part) => part?.trim());
      if (!platform || !url) return null;
      return { platform, url };
    })
    .filter(Boolean) as Array<{ platform: string; url: string }>;
}

function parseKeywords(value?: string | null) {
  if (!value) return [] as string[];
  return value
    .split(/,|\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export async function saveSiteSettings(_: SettingsState, formData: FormData): Promise<SettingsState> {
  const parsed = settingsSchema.safeParse({
    contactEmail: formData.get('contactEmail'),
    contactPhone: formData.get('contactPhone'),
    location: formData.get('location'),
    availability: formData.get('availability'),
    resumeUrl: formData.get('resumeUrl'),
    socialLinks: formData.get('socialLinks'),
    seoTitle: formData.get('seoTitle'),
    seoDescription: formData.get('seoDescription'),
    seoKeywords: formData.get('seoKeywords'),
    ogImage: formData.get('ogImage'),
    themeAccent: formData.get('themeAccent'),
    themeMode: formData.get('themeMode'),
    footerNote: formData.get('footerNote'),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    const errors: SettingsState['fieldErrors'] = {};
    for (const [key, value] of Object.entries(fieldErrors)) {
      if (value?.[0]) {
        (errors as Record<string, string>)[key] = value[0];
      }
    }
    return {
      status: 'error',
      message: 'Some details need attention. Please review the highlights.',
      fieldErrors: errors,
    };
  }

  const data = parsed.data;
  const existing = await prisma.siteSettings.findFirst();
  const socialLinks = parseSocialLinks(data.socialLinks);
  const seoKeywords = parseKeywords(data.seoKeywords);

  const payload = {
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone ?? null,
    location: data.location ?? null,
    availability: data.availability ?? null,
    resumeUrl: data.resumeUrl ?? null,
    socialLinks,
    seo: {
      title: data.seoTitle,
      description: data.seoDescription,
      keywords: seoKeywords,
      image: data.ogImage,
    },
    theme: {
      accent: data.themeAccent ?? 'violet',
      mode: data.themeMode,
    },
    notifications: {
      footerNote: data.footerNote,
    },
    footerNote: data.footerNote ?? null,
  };

  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data: payload });
  } else {
    await prisma.siteSettings.create({ data: payload });
  }

  revalidatePath('/client-site-settings');
  revalidatePath('/client-dashboard-content');

  return { status: 'success', message: 'Site settings updated successfully' };
}
