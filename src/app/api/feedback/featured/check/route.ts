import { NextResponse } from "next/server";
import { feedbackService } from "@/services/feedback.service";

export const dynamic = "force-dynamic";
export const revalidate = 60;

/**
 * GET /api/feedback/featured/check
 * Returns a simple boolean check if there are enough featured feedbacks (minimum 5)
 */
export async function GET() {
  try {
    const featuredFeedbacks = await feedbackService.getFeaturedFeedback();
    const count = featuredFeedbacks.length;
    const hasEnough = count >= 5;

    console.log(`[Featured Check] Found ${count} featured feedbacks, hasEnough: ${hasEnough}`);

    return NextResponse.json({
      hasEnough,
      count,
    });
  } catch (error) {
    console.error("[Featured Check] Error checking featured feedbacks:", error);
    return NextResponse.json(
      { error: "Failed to check featured feedbacks", hasEnough: false, count: 0 },
      { status: 500 }
    );
  }
}
