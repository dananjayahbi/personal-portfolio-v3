import { NextRequest, NextResponse } from "next/server";
import { getContactMessageById, markMessageAsRead, deleteContactMessage } from "@/services/contact-message.service";
import { z } from "zod";

const updateMessageSchema = z.object({
  read: z.boolean(),
});

/**
 * GET /api/contact-messages/[id]
 * Get a single contact message (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // TODO: Add admin authentication check

    const message = await getContactMessageById(id);

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error fetching contact message:", error);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/contact-messages/[id]
 * Update a contact message (mark as read/unread) (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // TODO: Add admin authentication check

    const body = await request.json();
    const validatedData = updateMessageSchema.parse(body);

    const message = await markMessageAsRead(id, validatedData.read);

    return NextResponse.json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating contact message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contact-messages/[id]
 * Delete a contact message (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // TODO: Add admin authentication check

    await deleteContactMessage(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
