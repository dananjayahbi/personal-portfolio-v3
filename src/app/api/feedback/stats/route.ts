import { NextRequest, NextResponse } from "next/server";
import { feedbackService } from "@/services/feedback.service";
import { getCurrentAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/feedback/stats
 * Get feedback statistics (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await feedbackService.getFeedbackStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching feedback stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback stats" },
      { status: 500 }
    );
  }
}
