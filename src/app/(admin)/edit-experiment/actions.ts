"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { UploadApiResponse } from "cloudinary";
import prisma from "@/lib/prisma";
import {
  buildExperimentData,
  experimentFormSchema,
  type ExperimentFieldErrors,
} from "@/app/(admin)/experiments/validation";
import { cloudinaryClient, derivePublicIdFromUrl, uploadFileToCloudinary } from "@/lib/cloudinary";

const updateSchema = experimentFormSchema.extend({
  experimentId: z.string().trim().min(1, "Missing experiment id"),
});

const deleteSchema = z.object({
  experimentId: z.string().trim().min(1, "Missing experiment id"),
});

export type ExperimentState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ExperimentFieldErrors & { experimentId?: string };
};

function normalizeUpdatePayload(data: ReturnType<typeof buildExperimentData>) {
  return {
    ...data,
    heroImage: data.heroImage ?? null,
    liveUrl: data.liveUrl ?? null,
    sourceUrl: data.sourceUrl ?? null,
    gallery: data.gallery ?? null,
    seo: data.seo ?? null,
  };
}

function parseExperimentGallery(value: unknown) {
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

export async function updateExperiment(_: ExperimentState, formData: FormData): Promise<ExperimentState> {
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
    experimentId: formData.get("experimentId"),
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
    
    const errors: ExperimentState["fieldErrors"] = {};
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
  const experiment = await prisma.experiment.findUnique({
    where: { id: data.experimentId },
  });

  if (!experiment) {
    return { status: "error", message: "Experiment not found. Refresh and try again." };
  }

  if (data.slug !== experiment.slug) {
    const slugConflict = await prisma.experiment.findUnique({ where: { slug: data.slug } });
    if (slugConflict) {
      return {
        status: "error",
        message: "Another experiment already uses this slug. Choose a different slug.",
        fieldErrors: { slug: "Slug already in use" },
      };
    }
  }

  const uploadedPublicIds: string[] = [];
  const staleAssetUrls: string[] = [];
  const previousGallery = parseExperimentGallery(experiment.gallery);
  const keptGalleryUrls = new Set(
    existingGalleryEntries.map((entry) => entry.split("|")[0]?.trim()).filter(Boolean),
  );
  const removedGalleryUrls = previousGallery
    .filter((item) => !keptGalleryUrls.has(item.url))
    .map((item) => item.url);
  staleAssetUrls.push(...removedGalleryUrls);

  let heroImageUrl = typeof data.heroImage === "string" && data.heroImage.trim().length
    ? data.heroImage.trim()
    : experiment.heroImage ?? undefined;
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
      if (experiment.heroImage) {
        staleAssetUrls.push(experiment.heroImage);
      }
    } else if (removeHeroImage) {
      heroImageUrl = undefined;
      if (experiment.heroImage) {
        staleAssetUrls.push(experiment.heroImage);
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

    const { experimentId, ...experimentFormInput } = {
      ...data,
      heroImage: heroImageUrl,
      gallery: galleryFieldValue,
    };

    const experimentData = normalizeUpdatePayload(buildExperimentData(experimentFormInput));

    await prisma.experiment.update({
      where: { id: experimentId },
      data: experimentData,
    });

    revalidatePath("/edit-experiment");
    revalidatePath(`/edit-experiment/${experimentId}`);
    revalidatePath("/client-dashboard-content");

    await cleanupAssetsByUrl(staleAssetUrls);

    return {
      status: "success",
      message: "Experiment updated successfully",
    };
  } catch (error) {
    console.error("Failed to update experiment", error);
    await cleanupUploadedAssets(uploadedPublicIds);
    return {
      status: "error",
      message: "We couldn't save your changes. Please try again.",
    };
  }
}

async function performExperimentDeletion(experimentId: string): Promise<ExperimentState> {
  const experiment = await prisma.experiment.findUnique({ where: { id: experimentId } });
  if (!experiment) {
    return {
      status: "error",
      message: "Experiment not found. It may have already been deleted.",
    };
  }

  const gallery = parseExperimentGallery(experiment.gallery);
  const assetUrls = [experiment.heroImage, ...gallery.map((item) => item.url)];

  await prisma.experiment.delete({ where: { id: experimentId } });

  revalidatePath("/edit-experiment");
  revalidatePath(`/edit-experiment/${experimentId}`);
  revalidatePath("/client-dashboard-content");

  await cleanupAssetsByUrl(assetUrls);

  return {
    status: "success",
    message: "Experiment deleted successfully",
  };
}

export async function deleteExperiment(_: ExperimentState, formData: FormData): Promise<ExperimentState> {
  const parsed = deleteSchema.safeParse({ experimentId: formData.get("experimentId") });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Missing experiment reference.",
      fieldErrors: { experimentId: "Missing experiment id" },
    };
  }

  return performExperimentDeletion(parsed.data.experimentId);
}

export async function deleteExperimentById(experimentId: string): Promise<ExperimentState> {
  if (!experimentId) {
    return {
      status: "error",
      message: "Missing experiment reference.",
    };
  }
  return performExperimentDeletion(experimentId);
}
