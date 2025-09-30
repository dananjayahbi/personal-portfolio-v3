import { NextResponse } from "next/server";
import { cloudinaryClient, ensureCloudinaryEnv } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    ensureCloudinaryEnv();

    const body = await request.json().catch(() => ({}));
    const { publicId, invalidate } = body as { publicId?: unknown; invalidate?: unknown };

    if (typeof publicId !== "string" || !publicId.trim()) {
      return NextResponse.json({ message: "A valid publicId is required." }, { status: 400 });
    }

    const result = await cloudinaryClient.uploader.destroy(publicId, {
      invalidate: Boolean(invalidate),
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Failed to destroy Cloudinary asset", error);
    return NextResponse.json({ message: "Unable to delete Cloudinary asset" }, { status: 500 });
  }
}
