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

type UploadOptions = {
  folder?: string;
  uploadPreset?: string;
  publicId?: string;
  resourceType?: UploadApiOptions["resource_type"];
  overwrite?: boolean;
  invalidate?: boolean;
  timeoutMs?: number;
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
