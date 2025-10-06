import { NextRequest, NextResponse } from "next/server";
import { createContactMessage, getAllContactMessages } from "@/services/contact-message.service";
import { z } from "zod";

// Validation schema for contact message
const createMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, "Message is required").max(2000),
});

/**
 * GET /api/contact-messages
 * Get all contact messages (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const { searchParams } = new URL(request.url);
    const filterRead = searchParams.get("read");
    
    const messages = await getAllContactMessages(
      filterRead === "true" ? true : filterRead === "false" ? false : undefined
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contact-messages
 * Create a new contact message (public)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createMessageSchema.parse(body);

    // Create message
    const message = await createContactMessage(validatedData);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
