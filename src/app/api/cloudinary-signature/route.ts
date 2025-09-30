import { NextResponse } from "next/server";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { folder, publicId, invalidate } = body ?? {};

    const signature = generateUploadSignature({
      folder,
      public_id: publicId,
      invalidate,
    });

    return NextResponse.json(signature);
  } catch (error) {
    console.error("Failed to generate Cloudinary signature", error);
    return NextResponse.json({ message: "Unable to sign upload" }, { status: 500 });
  }
}
