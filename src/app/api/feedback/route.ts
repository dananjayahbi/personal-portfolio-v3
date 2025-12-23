import { NextRequest, NextResponse } from "next/server";
import { feedbackService } from "@/services/feedback.service";

export const dynamic = "force-dynamic";

/**
 * GET /api/feedback
 * Fetch all feedback with optional filters
 * Query params: name, isAnonymous, minRating, maxRating, sortBy, sortOrder, limit, skip
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse filters from query params
    const filters: any = {};

    const name = searchParams.get("name");
    if (name) filters.name = name;

    const isAnonymous = searchParams.get("isAnonymous");
    if (isAnonymous !== null) {
      filters.isAnonymous = isAnonymous === "true";
    }

    const minRating = searchParams.get("minRating");
    if (minRating) filters.minRating = parseInt(minRating);

    const maxRating = searchParams.get("maxRating");
    if (maxRating) filters.maxRating = parseInt(maxRating);

    const sortBy = searchParams.get("sortBy");
    if (sortBy) filters.sortBy = sortBy;

    const sortOrder = searchParams.get("sortOrder");
    if (sortOrder) filters.sortOrder = sortOrder;

    const limit = searchParams.get("limit");
    if (limit) filters.limit = parseInt(limit);

    const skip = searchParams.get("skip");
    if (skip) filters.skip = parseInt(skip);

    const result = await feedbackService.getFeedback(filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/feedback
 * Create new feedback
 * Body: { name?, isAnonymous, rating, feedback }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (typeof body.rating !== "number" || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }

    if (!body.feedback || typeof body.feedback !== "string") {
      return NextResponse.json(
        { error: "Feedback text is required" },
        { status: 400 }
      );
    }

    if (body.feedback.trim().length < 5) {
      return NextResponse.json(
        { error: "Feedback must be at least 5 characters long" },
        { status: 400 }
      );
    }

    // Create feedback
    const feedback = await feedbackService.createFeedback({
      name: body.name,
      isAnonymous: body.isAnonymous ?? false,
      rating: body.rating,
      feedback: body.feedback.trim(),
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Failed to create feedback" },
      { status: 500 }
    );
  }
}
