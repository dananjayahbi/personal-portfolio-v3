import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * API Route: GET /api/resume-download
 * Proxies resume downloads through the server to bypass Cloudinary's "untrusted customer" restrictions
 * This downloads the PDF from Cloudinary using server-side credentials and serves it to the client
 */
export async function GET() {
  try {
    // Get the current resume from settings
    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { error: "No resume available" },
        { status: 404 }
      );
    }

    // Determine which URL to use
    let resumeUrl: string | null = null;
    let filename = "Dananjaya-resume.pdf"; // Custom filename for downloads

    if (settings.resumeCloudinaryUrl) {
      resumeUrl = settings.resumeCloudinaryUrl;
      // Use custom filename for Cloudinary resumes
      filename = "Dananjaya-resume.pdf";
    } else if (settings.resumeUrl) {
      resumeUrl = settings.resumeUrl;
      // For external URLs, try to extract filename or use custom
      const urlParts = resumeUrl.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart.includes('.pdf')) {
        filename = lastPart.split('?')[0]; // Remove query parameters
      } else {
        filename = "Dananjaya-resume.pdf"; // Fallback to custom name
      }
    }

    if (!resumeUrl) {
      return NextResponse.json(
        { error: "No resume available" },
        { status: 404 }
      );
    }

    console.log("[Resume Download] Fetching resume from:", resumeUrl);

    // Fetch the resume file from the URL (Cloudinary or external)
    const response = await fetch(resumeUrl, {
      headers: {
        // Add any necessary headers
      },
    });

    if (!response.ok) {
      console.error("[Resume Download] Failed to fetch resume:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch resume" },
        { status: response.status }
      );
    }

    // Get the file content as a buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("[Resume Download] Successfully fetched resume, size:", buffer.length, "bytes");

    // Serve the PDF with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("[Resume Download] Error:", error);
    return NextResponse.json(
      { error: "Failed to download resume" },
      { status: 500 }
    );
  }
}
