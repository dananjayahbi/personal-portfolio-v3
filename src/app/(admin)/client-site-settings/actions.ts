'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

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

export type SettingsState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof settingsSchema>, string>>;
};

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

export type ResumeUploadState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

export async function uploadResume(_: ResumeUploadState, formData: FormData): Promise<ResumeUploadState> {
  try {
    const file = formData.get('resumeFile');
    
    console.log('[uploadResume] FormData entries:', [...formData.entries()].map(([k, v]) => ({
      key: k,
      type: v instanceof File ? 'File' : typeof v,
      value: v instanceof File ? { name: v.name, size: v.size, type: v.type } : v,
    })));
    
    if (!file) {
      return { status: 'error', message: 'No file provided' };
    }

    // Check if it's actually a File object
    if (!(file instanceof File)) {
      console.error('[uploadResume] Received non-File object:', typeof file, file);
      return { status: 'error', message: 'Invalid file format received' };
    }

    // Check for empty file (size = 0)
    if (file.size === 0) {
      console.error('[uploadResume] File is empty:', { name: file.name, size: file.size, type: file.type });
      return { status: 'error', message: 'File appears to be empty. Please select a valid PDF file.' };
    }

    console.log('[uploadResume] File received:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Validate file type (PDF ONLY)
    if (file.type !== 'application/pdf') {
      return { status: 'error', message: 'File must be a PDF document' };
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { status: 'error', message: 'File size must be less than 10MB' };
    }

    // Get current settings to check for existing resume
    let settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      // Create settings if they don't exist
      settings = await prisma.siteSettings.create({
        data: {},
      });
    }

    // Delete old resume from Cloudinary if it exists
    if (settings.resumePublicId) {
      try {
        await deleteFromCloudinary(settings.resumePublicId, "raw");
        console.log("[Resume] Deleted old resume:", settings.resumePublicId);
      } catch (error) {
        console.error("[Resume] Error deleting old resume:", error);
        // Continue with upload even if delete fails
      }
    }

    // Read file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique public_id with .pdf extension included
    const timestamp = Date.now();
    
    // Upload PDF to Cloudinary as raw resource type
    // For raw files, we must include the .pdf extension in the public_id
    // and explicitly set format to 'pdf' to ensure proper file handling
    const uploadResult = await uploadBufferToCloudinary(buffer, {
      folder: "portfolio/assets",
      publicId: `resume-${timestamp}.pdf`, // Include .pdf in public_id
      resourceType: "raw", // PDFs are uploaded as raw files
      format: "pdf", // Explicitly specify PDF format
      filename: file.name, // Preserve original filename
      overwrite: false,
      invalidate: true,
    });

    console.log("[Resume] Upload result:", {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      format: uploadResult.format,
      resource_type: uploadResult.resource_type,
    });

    console.log("[Resume] Uploaded new resume:", uploadResult.public_id);

    // Update database with new Cloudinary URL and public ID
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        resumeCloudinaryUrl: uploadResult.secure_url,
        resumePublicId: uploadResult.public_id,
      },
    });

    // Revalidate paths that use the resume
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/client-site-settings');

    return { status: 'success', message: 'Resume uploaded successfully' };
  } catch (error) {
    console.error('Error uploading resume:', error);
    return { status: 'error', message: 'Failed to upload resume. Please try again.' };
  }
}

export async function deleteResume(): Promise<ResumeUploadState> {
  try {
    const settings = await prisma.siteSettings.findFirst();
    
    if (!settings || !settings.resumePublicId) {
      return { status: 'error', message: 'No resume found to delete' };
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(settings.resumePublicId, "raw");
      console.log("[Resume] Deleted resume from Cloudinary:", settings.resumePublicId);
    } catch (error) {
      console.error("[Resume] Error deleting from Cloudinary:", error);
      // Continue to update database even if Cloudinary deletion fails
    }

    // Update database to remove resume references
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        resumeCloudinaryUrl: null,
        resumePublicId: null,
      },
    });

    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/client-site-settings');

    return { status: 'success', message: 'Resume deleted successfully' };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return { status: 'error', message: 'Failed to delete resume. Please try again.' };
  }
}
