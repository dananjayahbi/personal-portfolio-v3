'use server';

import { revalidatePath } from "next/cache";
import type { UploadApiResponse } from "cloudinary";
import prisma from "@/lib/prisma";
import { buildProjectData, projectFormSchema, type ProjectFieldErrors } from "@/app/(admin)/projects/validation";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

type ProjectState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: ProjectFieldErrors;
};

export const initialProjectState: ProjectState = { status: 'idle' };

export async function createProject(_: ProjectState, formData: FormData): Promise<ProjectState> {
  let heroImageUrl: string | undefined;
  const heroFile = formData.get('heroImageFile');
  const heroFolder = formData.get('heroImageFolder');

  try {
    if (heroFile instanceof File && heroFile.size > 0) {
      const upload = await uploadFileToCloudinary(heroFile, {
        folder: typeof heroFolder === 'string' && heroFolder ? heroFolder : undefined,
      });
      heroImageUrl = upload.secure_url ?? upload.url ?? undefined;
    }
  } catch (error) {
    console.error('Failed to upload hero image to Cloudinary', error);
    return {
      status: 'error',
      message: 'We could not upload the hero image. Please try again.',
      fieldErrors: { heroImage: 'Upload failed. Please try again.' },
    };
  }

  const galleryFolder = formData.get('galleryFolder');
  const galleryFiles = formData
    .getAll('galleryImageFiles')
    .filter((value): value is File => value instanceof File && value.size > 0);
  const galleryCaptions = formData
    .getAll('galleryImageCaptions')
    .map((value) => (typeof value === 'string' ? value : ''));

  let galleryFieldValue = '';

  if (galleryFiles.length) {
    try {
      const uploads: UploadApiResponse[] = await Promise.all(
        galleryFiles.map((file) =>
          uploadFileToCloudinary(file, {
            folder: typeof galleryFolder === 'string' && galleryFolder ? galleryFolder : undefined,
          })
        )
      );

      galleryFieldValue = uploads
        .map((upload, index) => {
          const url = upload.secure_url ?? upload.url;
          const caption = galleryCaptions[index]?.trim();
          if (!url) return null;
          return caption ? `${url} | ${caption}` : url;
        })
        .filter((entry): entry is string => Boolean(entry))
        .join('\n');
    } catch (error) {
      console.error('Failed to upload gallery images to Cloudinary', error);
      return {
        status: 'error',
        message: 'We could not upload the gallery images. Please try again.',
        fieldErrors: { gallery: 'One or more gallery uploads failed.' },
      };
    }
  }

  const parsed = projectFormSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    summary: formData.get('summary'),
    description: formData.get('description'),
    heroImage: heroImageUrl,
    gallery: galleryFieldValue,
    technologies: formData.get('technologies'),
    tags: formData.get('tags'),
    deliverables: formData.get('deliverables'),
    liveUrl: formData.get('liveUrl'),
    sourceUrl: formData.get('sourceUrl'),
    status: formData.get('status'),
    isFeatured: formData.get('isFeatured'),
    featuredOrder: formData.get('featuredOrder'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    metrics: formData.get('metrics'),
    seoTitle: formData.get('seoTitle'),
    seoDescription: formData.get('seoDescription'),
  });

  if (!parsed.success) {
  const { fieldErrors } = parsed.error.flatten();
  const errors: ProjectFieldErrors = {};
    for (const key of Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>) {
      errors[key] = fieldErrors[key]?.[0];
    }
    return {
      status: 'error',
      message: 'We spotted a few issues—refine the highlighted fields.',
      fieldErrors: errors,
    };
  }

  const data = parsed.data;

  const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return {
      status: 'error',
      message: 'A project with this slug already exists. Try a different slug or edit the existing project.',
      fieldErrors: { slug: 'Slug already in use' },
    };
  }

  const projectData = buildProjectData(data);

  await prisma.project.create({
    data: projectData,
  });

  revalidatePath('/edit-project');

  return {
    status: 'success',
    message: 'Project published to your portfolio universe. You can refine it anytime.',
  };
}
