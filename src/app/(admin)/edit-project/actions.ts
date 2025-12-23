"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { UploadApiResponse } from "cloudinary";
import prisma from "@/lib/prisma";
import {
  buildProjectData,
  projectFormSchema,
  type ProjectFieldErrors,
} from "@/app/(admin)/projects/validation";
import { cloudinaryClient, derivePublicIdFromUrl, uploadFileToCloudinary } from "@/lib/cloudinary";

const updateSchema = projectFormSchema.extend({
  projectId: z.string().trim().min(1, "Missing project id"),
});

const deleteSchema = z.object({
  projectId: z.string().trim().min(1, "Missing project id"),
});

export type ProjectState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ProjectFieldErrors & { projectId?: string };
};

function normalizeUpdatePayload(data: ReturnType<typeof buildProjectData>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {
    ...data,
    heroImage: data.heroImage ?? null,
    liveUrl: data.liveUrl ?? null,
    sourceUrl: data.sourceUrl ?? null,
    seo: data.seo ?? null,
  };
  
  // Handle gallery separately to avoid Prisma JSON type issues
  if (data.gallery !== undefined) {
    result.gallery = data.gallery;
  }
  
  return result;
}

function parseProjectGallery(value: unknown) {
  if (!Array.isArray(value)) return [] as Array<{ url: string; alt: string | null }>;
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [] as Array<{ url: string; alt: string | null }>;
    const record = item as { url?: unknown; alt?: unknown };
    if (typeof record.url !== "string") return [] as Array<{ url: string; alt: string | null }>;
    return [{ url: record.url, alt: typeof record.alt === "string" ? record.alt : null }];
  });
}

async function cleanupUploadedAssets(publicIds: string[]) {
  if (!publicIds.length) return;
  await Promise.allSettled(
    publicIds.map((publicId) =>
      cloudinaryClient.uploader.destroy(publicId, { invalidate: true }).catch((error) => {
        console.warn(`Failed to cleanup Cloudinary asset ${publicId}`, error);
      }),
    ),
  );
}

async function cleanupAssetsByUrl(urls: Array<string | undefined | null>) {
  const publicIds = urls
    .map((url) => derivePublicIdFromUrl(url))
    .filter((id): id is string => Boolean(id));
  if (!publicIds.length) return;
  await cleanupUploadedAssets(publicIds);
}

export async function updateProject(_: ProjectState, formData: FormData): Promise<ProjectState> {
  const heroFile = formData.get("heroImageFile");
  const heroFolder = formData.get("heroImageFolder");
  const galleryFolder = formData.get("galleryFolder");
  const galleryFiles = formData
    .getAll("galleryImageFiles")
    .filter((value): value is File => value instanceof File && value.size > 0);
  const galleryCaptions = formData
    .getAll("galleryImageCaptions")
    .map((value) => (typeof value === "string" ? value : ""));
  const existingGalleryEntries = formData
    .getAll("existingGalleryEntries")
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
  const removeHeroImage = formData.get("removeHeroImage") === "true";

  const parsed = updateSchema.safeParse({
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    heroImage: formData.get("heroImage"),
    gallery: formData.get("gallery"),
    technologies: formData.get("technologies"),
    tags: formData.get("tags"),
    liveUrl: formData.get("liveUrl"),
    sourceUrl: formData.get("sourceUrl"),
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured"),
    featuredOrder: formData.get("featuredOrder"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  });

  if (!parsed.success) {
    console.log("❌ Validation failed!");
    console.log("Full error object:", JSON.stringify(parsed.error, null, 2));
    
    const { fieldErrors } = parsed.error.flatten();
    console.log("Field errors extracted:", fieldErrors);
    
    const errors: ProjectState["fieldErrors"] = {};
    for (const [key, value] of Object.entries(fieldErrors)) {
      if (value?.[0]) {
        (errors as Record<string, string>)[key] = value[0];
        console.log(`Field "${key}" has error: ${value[0]}`);
      }
    }
    
    console.log("Final errors object:", errors);
    console.log("Number of errors:", Object.keys(errors).length);
    
    return {
      status: "error",
      message: Object.keys(errors).length > 0 
        ? "Please review the highlighted fields before saving."
        : "Validation error occurred. Please check your input.",
      fieldErrors: errors,
    };
  }

  const data = parsed.data;
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
  });

  if (!project) {
    return { status: "error", message: "Project not found. Refresh and try again." };
  }

  if (data.slug !== project.slug) {
    const slugConflict = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (slugConflict) {
      return {
        status: "error",
        message: "Another project already uses this slug. Choose a different slug.",
        fieldErrors: { slug: "Slug already in use" },
      };
    }
  }

  const uploadedPublicIds: string[] = [];
  const staleAssetUrls: string[] = [];
  const previousGallery = parseProjectGallery(project.gallery);
  const keptGalleryUrls = new Set(
    existingGalleryEntries.map((entry) => entry.split("|")[0]?.trim()).filter(Boolean),
  );
  const removedGalleryUrls = previousGallery
    .filter((item) => !keptGalleryUrls.has(item.url))
    .map((item) => item.url);
  staleAssetUrls.push(...removedGalleryUrls);

  let heroImageUrl = typeof data.heroImage === "string" && data.heroImage.trim().length
    ? data.heroImage.trim()
    : project.heroImage ?? undefined;
  let galleryFieldValue = typeof data.gallery === "string" ? data.gallery : undefined;

  try {
    if (heroFile instanceof File && heroFile.size > 0) {
      const upload = await uploadFileToCloudinary(heroFile, {
        folder: typeof heroFolder === "string" && heroFolder ? heroFolder : undefined,
        timeoutMs: 120_000,
      });
      heroImageUrl = upload.secure_url ?? upload.url ?? undefined;
      if (upload.public_id) {
        uploadedPublicIds.push(upload.public_id);
      }
      if (project.heroImage) {
        staleAssetUrls.push(project.heroImage);
      }
    } else if (removeHeroImage) {
      heroImageUrl = undefined;
      if (project.heroImage) {
        staleAssetUrls.push(project.heroImage);
      }
    }

    const galleryUploads: UploadApiResponse[] = [];
    if (galleryFiles.length) {
      for (let index = 0; index < galleryFiles.length; index += 1) {
        const file = galleryFiles[index];
        const upload = await uploadFileToCloudinary(file, {
          folder: typeof galleryFolder === "string" && galleryFolder ? galleryFolder : undefined,
          timeoutMs: 120_000,
        });
        galleryUploads.push(upload);
        if (upload.public_id) {
          uploadedPublicIds.push(upload.public_id);
        }
      }
    }

    const galleryEntriesFromUploads = galleryUploads
      .map((upload, index) => {
        const url = upload.secure_url ?? upload.url;
        const caption = galleryCaptions[index]?.trim();
        if (!url) return null;
        return caption ? `${url} | ${caption}` : url;
      })
      .filter((entry): entry is string => Boolean(entry));

    const mergedGalleryEntries = [galleryFieldValue, ...galleryEntriesFromUploads]
      .map((entry) => entry?.trim())
      .filter((entry): entry is string => Boolean(entry?.length));
    galleryFieldValue = mergedGalleryEntries.length ? mergedGalleryEntries.join("\n") : undefined;

    const { projectId, ...projectFormInput } = {
      ...data,
      heroImage: heroImageUrl,
      gallery: galleryFieldValue,
    };

    const projectData = normalizeUpdatePayload(buildProjectData(projectFormInput));

    await prisma.project.update({
      where: { id: projectId },
      data: projectData,
    });

    revalidatePath("/edit-project");
    revalidatePath(`/edit-project/${projectId}`);
    revalidatePath("/client-dashboard-content");

    await cleanupAssetsByUrl(staleAssetUrls);

    return {
      status: "success",
      message: "Project updated successfully",
    };
  } catch (error) {
    console.error("Failed to update project", error);
    await cleanupUploadedAssets(uploadedPublicIds);
    return {
      status: "error",
      message: "We couldn't save your changes. Please try again.",
    };
  }
}

async function performProjectDeletion(projectId: string): Promise<ProjectState> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return {
      status: "error",
      message: "Project not found. It may have already been deleted.",
    };
  }

  const gallery = parseProjectGallery(project.gallery);
  const assetUrls = [project.heroImage, ...gallery.map((item) => item.url)];

  await prisma.project.delete({ where: { id: projectId } });

  revalidatePath("/edit-project");
  revalidatePath(`/edit-project/${projectId}`);
  revalidatePath("/client-dashboard-content");

  await cleanupAssetsByUrl(assetUrls);

  return {
    status: "success",
    message: "Project deleted successfully",
  };
}

export async function deleteProject(_: ProjectState, formData: FormData): Promise<ProjectState> {
  const parsed = deleteSchema.safeParse({ projectId: formData.get("projectId") });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Missing project reference.",
      fieldErrors: { projectId: "Missing project id" },
    };
  }

  return performProjectDeletion(parsed.data.projectId);
}

export async function deleteProjectById(projectId: string): Promise<ProjectState> {
  if (!projectId) {
    return {
      status: "error",
      message: "Missing project reference.",
    };
  }
  return performProjectDeletion(projectId);
}
