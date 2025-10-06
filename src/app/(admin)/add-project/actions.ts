'use server';

import { revalidatePath } from "next/cache";
import type { UploadApiResponse } from "cloudinary";
import prisma from "@/lib/prisma";
import { buildProjectData, projectFormSchema, type ProjectFieldErrors } from "@/app/(admin)/projects/validation";
import { cloudinaryClient, uploadFileToCloudinary } from "@/lib/cloudinary";
import type { ProjectState } from "./project-state";

export async function createProject(_: ProjectState, formData: FormData): Promise<ProjectState> {
  const getString = (key: string) => {
    const value = formData.get(key);
    return typeof value === 'string' ? value : undefined;
  };

  const heroFile = formData.get('heroImageFile');
  const heroFolder = getString('heroImageFolder');
  const galleryFolder = getString('galleryFolder');
  const galleryFiles = formData
    .getAll('galleryImageFiles')
    .filter((value): value is File => value instanceof File && value.size > 0);
  const galleryCaptions = formData
    .getAll('galleryImageCaptions')
    .map((value) => (typeof value === 'string' ? value : ''));

  const parsed = projectFormSchema.safeParse({
    title: getString('title'),
    summary: getString('summary'),
    slug: getString('slug'),
    description: getString('description'),
    heroImage: getString('heroImage'),
    gallery: getString('gallery'),
    technologies: getString('technologies'),
    tags: getString('tags'),
    liveUrl: getString('liveUrl'),
    sourceUrl: getString('sourceUrl'),
    status: getString('status'),
    isFeatured: getString('isFeatured'),
    featuredOrder: getString('featuredOrder'),
    seoTitle: getString('seoTitle'),
    seoDescription: getString('seoDescription'),
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

  const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return {
      status: 'error',
      message: 'A project with this slug already exists. Try a different slug or edit the existing project.',
      fieldErrors: { slug: 'Slug already in use' },
    };
  }

  const uploadedPublicIds: string[] = [];
  let heroImageUrl = parsed.data.heroImage;

  try {
    if (heroFile instanceof File && heroFile.size > 0) {
      const upload = await uploadFileToCloudinary(heroFile, {
        folder: heroFolder ?? undefined,
        timeoutMs: 120_000,
      });
      heroImageUrl = upload.secure_url ?? upload.url ?? undefined;
      if (upload.public_id) {
        uploadedPublicIds.push(upload.public_id);
      }
    }
  } catch (error) {
    console.error('Failed to upload hero image to Cloudinary', error);
    await cleanupUploadedAssets(uploadedPublicIds);
    return {
      status: 'error',
      message: 'We could not upload the hero image. Please try again.',
      fieldErrors: { heroImage: 'Upload failed. Please try again.' },
    };
  }

  let galleryFieldValue = parsed.data.gallery;

  if (galleryFiles.length) {
    const galleryUploads: UploadApiResponse[] = [];
    try {
      for (let index = 0; index < galleryFiles.length; index += 1) {
        const file = galleryFiles[index];
        const upload = await uploadFileToCloudinary(file, {
          folder: galleryFolder ?? undefined,
          timeoutMs: 120_000,
        });
        galleryUploads.push(upload);
        if (upload.public_id) {
          uploadedPublicIds.push(upload.public_id);
        }
      }
    } catch (error) {
      console.error('Failed to upload gallery images to Cloudinary', error);
      await cleanupUploadedAssets(uploadedPublicIds);
      return {
        status: 'error',
        message: 'We could not upload the gallery images. Please try again.',
        fieldErrors: { gallery: 'One or more gallery uploads failed.' },
      };
    }

    const galleryEntries = galleryUploads
      .map((upload, index) => {
        const url = upload.secure_url ?? upload.url;
        const caption = galleryCaptions[index]?.trim();
        if (!url) return null;
        return caption ? `${url} | ${caption}` : url;
      })
      .filter((entry): entry is string => Boolean(entry));

    galleryFieldValue = galleryEntries.length ? galleryEntries.join('\n') : undefined;
  }

  const submission = {
    ...parsed.data,
    heroImage: heroImageUrl,
    gallery: galleryFieldValue,
  };

  const projectData = buildProjectData(submission);

  await prisma.project.create({
    data: projectData,
  });

  revalidatePath('/edit-project');

  return {
    status: 'success',
    message: 'Project published to your portfolio universe. You can refine it anytime.',
  };
}

async function cleanupUploadedAssets(publicIds: string[]) {
  if (!publicIds.length) return;
  await Promise.allSettled(
    publicIds.map((publicId) =>
      cloudinaryClient.uploader.destroy(publicId, { invalidate: true }).catch((error) => {
        console.warn(`Failed to cleanup Cloudinary asset ${publicId}`, error);
      })
    )
  );
}
