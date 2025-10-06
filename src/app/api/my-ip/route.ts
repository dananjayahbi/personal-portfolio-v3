import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/my-ip
 * Get the client's IP address
 */
export async function GET(request: NextRequest) {
  try {
    // Get IP from request headers (set by Next.js or proxy)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    return NextResponse.json({ ip });
  } catch (error) {
    console.error("Error getting IP:", error);
    return NextResponse.json(
      { error: "Failed to get IP address" },
      { status: 500 }
    );
  }
}
