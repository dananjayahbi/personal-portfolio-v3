import { Buffer } from "node:buffer";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiOptions, UploadApiResponse } from "cloudinary";

type SignableValue = string | number | boolean | undefined | null;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const serverApiKey = process.env.CLOUDINARY_API_KEY;
const clientApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const apiKey = serverApiKey ?? clientApiKey;

const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET ?? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function ensureCloudinaryEnv() {
  const missing: string[] = [];

  if (!cloudName) missing.push("CLOUDINARY_CLOUD_NAME (or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)");
  if (!apiKey) missing.push("CLOUDINARY_API_KEY (or NEXT_PUBLIC_CLOUDINARY_API_KEY)");
  if (!apiSecret) missing.push("CLOUDINARY_API_SECRET");
  if (!uploadPreset) missing.push("CLOUDINARY_UPLOAD_PRESET (or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)");

  if (missing.length) {
    throw new Error(`Missing Cloudinary configuration. Add ${missing.join(", ")}.`);
  }
}

export function getCloudinaryConfig() {
  ensureCloudinaryEnv();
  return {
    cloudName,
    apiKey: apiKey!,
    uploadPreset: uploadPreset!,
  } as const;
}

export const cloudinaryClient = cloudinary;

export function derivePublicIdFromUrl(url?: string | null) {
  if (!url) return undefined;
  try {
    const marker = "/upload/";
    const index = url.indexOf(marker);
    if (index === -1) return undefined;
    const pathWithVersion = url.slice(index + marker.length);
    const path = pathWithVersion.replace(/^v\d+\//, "");
    const sanitized = path.split(/[?#]/)[0];
    if (!sanitized) return undefined;
    const lastDot = sanitized.lastIndexOf(".");
    return lastDot === -1 ? sanitized : sanitized.slice(0, lastDot);
  } catch (error) {
    console.warn("Unable to derive Cloudinary public id from url", error);
    return undefined;
  }
}

type UploadOptions = {
  folder?: string;
  uploadPreset?: string;
  publicId?: string;
  resourceType?: UploadApiOptions["resource_type"];
  overwrite?: boolean;
  invalidate?: boolean;
  timeoutMs?: number;
  format?: string;
  filename?: string; // Add filename option to preserve original filename
};

export async function uploadFileToCloudinary(file: File, options: UploadOptions = {}) {
  ensureCloudinaryEnv();

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadOptions: UploadApiOptions = {
    folder: options.folder,
    upload_preset: options.uploadPreset ?? uploadPreset ?? undefined,
    public_id: options.publicId,
    resource_type: options.resourceType ?? "image",
    overwrite: options.overwrite,
    invalidate: options.invalidate,
    timeout: options.timeoutMs,
    format: options.format,
  };

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinaryClient.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Cloudinary upload failed"));
      } else {
        resolve(result);
      }
    });

    stream.end(buffer);
  });
}

function normalizeParams(params: Record<string, SignableValue>) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => {
        if (typeof value === "boolean") {
          return [key, value ? "true" : "false"];
        }
        if (typeof value === "number") {
          return [key, value.toString()];
        }
        return [key, value];
      })
  );
}

export function generateUploadSignature(params: Record<string, SignableValue> = {}) {
  ensureCloudinaryEnv();

  const timestamp = params.timestamp ?? Math.round(Date.now() / 1000);

  const paramsToSign = normalizeParams({
    ...params,
    timestamp,
    upload_preset: params.upload_preset ?? uploadPreset,
    source: params.source ?? "uw",
  });

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret!);

  return {
    signature,
    timestamp: Number(paramsToSign.timestamp),
    uploadPreset: uploadPreset!,
    cloudName: cloudName!,
    apiKey: apiKey!,
  } as const;
}

/**
 * Delete a file from Cloudinary by public ID
 */
export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "raw" | "video" | "auto" = "image") {
  ensureCloudinaryEnv();

  try {
    const result = await cloudinaryClient.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    
    console.log(`[Cloudinary] Deleted ${publicId}:`, result);
    return result;
  } catch (error) {
    console.error(`[Cloudinary] Error deleting ${publicId}:`, error);
    throw error;
  }
}

/**
 * Upload a file buffer to Cloudinary (for server-side uploads)
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {}
) {
  ensureCloudinaryEnv();

  const uploadOptions: UploadApiOptions = {
    folder: options.folder,
    upload_preset: options.uploadPreset ?? uploadPreset ?? undefined,
    public_id: options.publicId,
    resource_type: options.resourceType ?? "image",
    overwrite: options.overwrite,
    invalidate: options.invalidate,
    timeout: options.timeoutMs,
    format: options.format,
    filename: options.filename, // Preserve original filename
  };

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinaryClient.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Cloudinary upload failed"));
      } else {
        resolve(result);
      }
    });

    stream.end(buffer);
  });
}

/**
 * Generate a signed/authenticated URL for private or raw files
 * This is necessary for accounts marked as "untrusted" or for secure file access
 */
export function generateAuthenticatedUrl(
  publicId: string,
  options: {
    resourceType?: "image" | "raw" | "video" | "auto";
    type?: string;
    attachment?: boolean;
    expiresAt?: number; // Unix timestamp
  } = {}
) {
  ensureCloudinaryEnv();

  const {
    resourceType = "raw",
    type = "upload",
    attachment = true,
    expiresAt,
  } = options;

  // Build transformation/flags
  const flags: string[] = [];
  if (attachment) {
    flags.push("attachment");
  }

  // Use Cloudinary's url method to generate an authenticated URL
  const url = cloudinaryClient.url(publicId, {
    resource_type: resourceType,
    type,
    sign_url: true, // This creates a signed URL
    secure: true, // Use HTTPS
    flags: flags.length > 0 ? flags.join(",") : undefined,
    expires_at: expiresAt,
  });

  return url;
}
