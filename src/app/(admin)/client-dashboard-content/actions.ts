'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";

const contentSchema = z.object({
  heroEyebrow: z.string().trim().min(2, "Add a short pre-header"),
  heroHeadline: z.string().trim().min(6, "Headline is required"),
  heroSubheadline: z.string().trim().min(10, "Write a short narrative"),
  primaryCtaLabel: z.string().trim().min(1, "Primary CTA label required"),
  primaryCtaUrl: z.string().trim().url("Enter a valid URL"),
  secondaryCtaLabel: z.string().trim().optional(),
  secondaryCtaUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .pipe(z.string().url("Enter a valid URL").optional()),
  highlightOne: z.string().trim().optional(),
  highlightTwo: z.string().trim().optional(),
  highlightThree: z.string().trim().optional(),
  aboutTitle: z.string().trim().min(4, "About title required"),
  aboutSummary: z.string().trim().min(12, "Share a concise summary"),
  aboutNarrative: z.string().trim().optional(),
  skills: z.string().trim().optional(),
  experiences: z.string().trim().optional(),
});

export type ContentState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof contentSchema>, string>>;
};

function parseList(value?: string | null) {
  if (!value) return [] as string[];
  return value
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseExperiences(value?: string | null) {
  if (!value) return [] as Array<{ company: string; role: string; period: string; description?: string }>;
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|').map((part) => part?.trim());
      if (parts.length < 3) return null;
      return {
        company: parts[0],
        role: parts[1],
        period: parts[2],
        description: parts[3] || undefined,
      };
    })
    .filter(Boolean) as Array<{ company: string; role: string; period: string; description?: string }>;
}

export async function saveDashboardContent(_: ContentState, formData: FormData): Promise<ContentState> {
  const parsed = contentSchema.safeParse({
    heroEyebrow: formData.get('heroEyebrow'),
    heroHeadline: formData.get('heroHeadline'),
    heroSubheadline: formData.get('heroSubheadline'),
    primaryCtaLabel: formData.get('primaryCtaLabel'),
    primaryCtaUrl: formData.get('primaryCtaUrl'),
    secondaryCtaLabel: formData.get('secondaryCtaLabel'),
    secondaryCtaUrl: formData.get('secondaryCtaUrl'),
    highlightOne: formData.get('highlightOne'),
    highlightTwo: formData.get('highlightTwo'),
    highlightThree: formData.get('highlightThree'),
    aboutTitle: formData.get('aboutTitle'),
    aboutSummary: formData.get('aboutSummary'),
    aboutNarrative: formData.get('aboutNarrative'),
    skills: formData.get('skills'),
    experiences: formData.get('experiences'),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    const errors: ContentState['fieldErrors'] = {};
    for (const key of Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>) {
      errors[key] = fieldErrors[key]?.[0];
    }
    return {
      status: 'error',
      message: 'Please review the highlighted fields',
      fieldErrors: errors,
    };
  }

  const data = parsed.data;
  const highlights = [data.highlightOne, data.highlightTwo, data.highlightThree].filter(Boolean) as string[];
  const skills = parseList(data.skills);
  const experiences = parseExperiences(data.experiences);

  const payload = {
    hero: {
      eyebrow: data.heroEyebrow,
      headline: data.heroHeadline,
      subheadline: data.heroSubheadline,
      highlights,
    },
    callToActions: {
      primary: {
        label: data.primaryCtaLabel,
        url: data.primaryCtaUrl,
      },
      secondary: data.secondaryCtaLabel && data.secondaryCtaUrl
        ? {
            label: data.secondaryCtaLabel,
            url: data.secondaryCtaUrl,
          }
        : null,
    },
    about: {
      title: data.aboutTitle,
      summary: data.aboutSummary,
      narrative: data.aboutNarrative,
    },
    skills,
    experiences,
  };

  const existing = await prisma.portfolioContent.findFirst();
  if (existing) {
    await prisma.portfolioContent.update({
      where: { id: existing.id },
      data: {
        hero: payload.hero,
        callToActions: payload.callToActions,
        about: payload.about,
        skills: payload.skills,
        experiences: payload.experiences,
      },
    });
  } else {
    await prisma.portfolioContent.create({
      data: {
        hero: payload.hero,
        callToActions: payload.callToActions,
        about: payload.about,
        skills: payload.skills,
        experiences: payload.experiences,
      },
    });
  }

  revalidatePath('/client-dashboard-content');

  return { status: 'success', message: 'Dashboard content saved successfully' };
}
