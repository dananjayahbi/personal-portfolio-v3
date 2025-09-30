import { NextResponse } from "next/server";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { paramsToSign, folder, publicId, invalidate, ...rest } = (body ?? {}) as Record<string, unknown>;

    const params: Record<string, string | number | boolean | undefined> = {};

    if (typeof paramsToSign === "object" && paramsToSign !== null) {
      for (const [key, value] of Object.entries(paramsToSign)) {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          params[key] = value;
        }
      }
    }

    if (typeof folder === "string" && params.folder === undefined) {
      params.folder = folder;
    }
    if (typeof publicId === "string" && params.public_id === undefined) {
      params.public_id = publicId;
    }
    if (typeof invalidate === "boolean" && params.invalidate === undefined) {
      params.invalidate = invalidate;
    }

    for (const [key, value] of Object.entries(rest)) {
      if (params[key] === undefined && (typeof value === "string" || typeof value === "number" || typeof value === "boolean")) {
        params[key] = value;
      }
    }

    const signature = generateUploadSignature(params);

    return NextResponse.json(signature);
  } catch (error) {
    console.error("Failed to generate Cloudinary signature", error);
    return NextResponse.json({ message: "Unable to sign upload" }, { status: 500 });
  }
}
