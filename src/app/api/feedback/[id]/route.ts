import { NextRequest, NextResponse } from "next/server";
import { feedbackService } from "@/services/feedback.service";
import { getCurrentAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/feedback/[id]
 * Delete feedback by ID (Admin only)
 */
export async function DELETE(
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

    await feedbackService.deleteFeedback(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json(
      { error: "Failed to delete feedback" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/feedback/[id]
 * Toggle feedback disabled state (Admin only)
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

    const updatedFeedback = await feedbackService.toggleFeedbackDisabled(id);

    return NextResponse.json(updatedFeedback);
  } catch (error) {
    console.error("Error toggling feedback disabled state:", error);
    return NextResponse.json(
      { error: "Failed to toggle feedback state" },
      { status: 500 }
    );
  }
}
