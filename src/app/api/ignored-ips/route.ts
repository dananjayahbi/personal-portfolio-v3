import { NextRequest, NextResponse } from "next/server";
import {
  getAllIgnoredIPs,
  addIgnoredIP,
  removeIgnoredIP,
} from "@/services/analytics.service";
import { z } from "zod";

const addIgnoredIPSchema = z.object({
  ip: z.string().min(1, "IP address is required"),
  description: z.string().optional(),
});

/**
 * GET /api/ignored-ips
 * Get all ignored IPs (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check

    const ignoredIPs = await getAllIgnoredIPs();

    return NextResponse.json(ignoredIPs);
  } catch (error) {
    console.error("Error fetching ignored IPs:", error);
    return NextResponse.json(
      { error: "Failed to fetch ignored IPs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ignored-ips
 * Add an IP to the ignored list (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check

    const body = await request.json();
    const validatedData = addIgnoredIPSchema.parse(body);

    const ignoredIP = await addIgnoredIP(
      validatedData.ip,
      validatedData.description
    );

    return NextResponse.json(ignoredIP, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error adding ignored IP:", error);
    return NextResponse.json(
      { error: "Failed to add ignored IP" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ignored-ips?id=xxx
 * Remove an IP from the ignored list (admin only)
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

    await removeIgnoredIP(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing ignored IP:", error);
    return NextResponse.json(
      { error: "Failed to remove ignored IP" },
      { status: 500 }
    );
  }
}
