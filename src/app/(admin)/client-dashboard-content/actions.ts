'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

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
  experiences: z.string().trim().optional(),
});

export type ContentState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof contentSchema>, string>>;
};

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
        experiences: payload.experiences,
      },
    });
  } else {
    await prisma.portfolioContent.create({
      data: {
        hero: payload.hero,
        callToActions: payload.callToActions,
        about: payload.about,
        experiences: payload.experiences,
      },
    });
  }

  revalidatePath('/client-dashboard-content');

  return { status: 'success', message: 'Dashboard content saved successfully' };
}

export type GitHubGraphState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

export async function uploadGitHubGraph(_: GitHubGraphState, formData: FormData): Promise<GitHubGraphState> {
  try {
    const file = formData.get('graphImage') as File;
    
    if (!file) {
      return { status: 'error', message: 'No file provided' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { status: 'error', message: 'File must be an image' };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { status: 'error', message: 'File size must be less than 5MB' };
    }

    // Get current settings to check for existing GitHub graph
    let settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      // Create settings if they don't exist
      settings = await prisma.siteSettings.create({
        data: {},
      });
    }

    // Delete old GitHub graph from Cloudinary if it exists
    if (settings.githubGraphPublicId) {
      try {
        await deleteFromCloudinary(settings.githubGraphPublicId, "image");
        console.log("[GitHub Graph] Deleted old graph:", settings.githubGraphPublicId);
      } catch (error) {
        console.error("[GitHub Graph] Error deleting old graph:", error);
        // Continue with upload even if delete fails
      }
    }

    // Read file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadBufferToCloudinary(buffer, {
      folder: "portfolio/assets",
      publicId: "github-status-graph",
      resourceType: "image",
      overwrite: true,
      invalidate: true,
    });

    console.log("[GitHub Graph] Uploaded new graph:", uploadResult.public_id);

    // Update database with new Cloudinary URL and public ID
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        githubGraphUrl: uploadResult.secure_url,
        githubGraphPublicId: uploadResult.public_id,
      },
    });

    // Revalidate paths that display the graph
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/client-dashboard-content');

    return { status: 'success', message: 'GitHub graph updated successfully' };
  } catch (error) {
    console.error('Error uploading GitHub graph:', error);
    return { status: 'error', message: 'Failed to upload graph. Please try again.' };
  }
}
