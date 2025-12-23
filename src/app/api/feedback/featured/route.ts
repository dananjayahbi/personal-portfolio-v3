import { NextRequest, NextResponse } from "next/server";
import { feedbackService } from "@/services/feedback.service";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

/**
 * GET /api/feedback/featured
 * Get all featured feedback (public endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    const featuredFeedback = await feedbackService.getFeaturedFeedback();

    return NextResponse.json(featuredFeedback);
  } catch (error) {
    console.error("Error fetching featured feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured feedback" },
      { status: 500 }
    );
  }
}
