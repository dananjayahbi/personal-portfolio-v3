import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

export function ensureCloudinaryEnv() {
  if (!cloudName || !apiKey || !apiSecret || !uploadPreset) {
    throw new Error("Missing Cloudinary configuration. Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and CLOUDINARY_UPLOAD_PRESET are set.");
  }
}

export function getCloudinaryConfig() {
  ensureCloudinaryEnv();
  return {
    cloudName,
    apiKey,
    uploadPreset,
  } as const;
}

export const cloudinaryClient = cloudinary;

export function generateUploadSignature(options: Pick<UploadApiOptions, "folder" | "public_id" | "invalidate"> & { timestamp?: number } = {}) {
  ensureCloudinaryEnv();
  const timestamp = options.timestamp ?? Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, string | number | boolean | undefined> = {
    timestamp,
    folder: options.folder,
    public_id: options.public_id,
    invalidate: options.invalidate,
    upload_preset: uploadPreset,
  };

  const filtered = Object.fromEntries(
    Object.entries(paramsToSign).filter(([, value]) => value !== undefined && value !== "")
  );

  const signature = cloudinary.utils.api_sign_request(filtered, apiSecret!);

  return {
    signature,
    timestamp,
    uploadPreset,
    cloudName,
    apiKey,
  };
}
