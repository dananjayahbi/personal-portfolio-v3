import { NextRequest, NextResponse } from "next/server";
import { feedbackService } from "@/services/feedback.service";
import { getCurrentAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/feedback/[id]/featured
 * Toggle feedback featured state (Admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const updatedFeedback = await feedbackService.toggleFeedbackFeatured(id);

    return NextResponse.json(updatedFeedback);
  } catch (error) {
    console.error("Error toggling feedback featured state:", error);
    return NextResponse.json(
      { error: "Failed to toggle feedback featured state" },
      { status: 500 }
    );
  }
}
