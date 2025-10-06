import { NextRequest, NextResponse } from "next/server";
import { trackPageView } from "@/services/analytics.service";

/**
 * POST /api/page-views
 * Track a page view (called from client)
 */
export async function POST(request: NextRequest) {
  try {
    // Get IP from request headers (set by Next.js or proxy)
    const ip = 
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || undefined;

    // Track the view
    await trackPageView(ip, userAgent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking page view:", error);
    return NextResponse.json(
      { error: "Failed to track page view" },
      { status: 500 }
    );
  }
}
