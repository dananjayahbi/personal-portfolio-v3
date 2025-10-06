import { NextRequest, NextResponse } from "next/server";
import {
  getAllPageViews,
  getTotalViews,
  getUniqueVisitorsCount,
  deletePageView,
} from "@/services/analytics.service";

/**
 * GET /api/analytics
 * Get all analytics data (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check

    const [views, totalViews, uniqueVisitors] = await Promise.all([
      getAllPageViews(),
      getTotalViews(),
      getUniqueVisitorsCount(),
    ]);

    return NextResponse.json({
      views,
      stats: {
        totalViews,
        uniqueVisitors,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/analytics?id=xxx
 * Delete a page view record (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add admin authentication check

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    await deletePageView(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page view:", error);
    return NextResponse.json(
      { error: "Failed to delete page view" },
      { status: 500 }
    );
  }
}
