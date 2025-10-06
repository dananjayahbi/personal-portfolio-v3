import { NextRequest, NextResponse } from "next/server";
import { updateTechnology, deleteTechnology } from "@/services/technology.service";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const technology = await updateTechnology(id, data);
    return NextResponse.json(technology);
  } catch (error) {
    console.error("Failed to update technology:", error);
    return NextResponse.json(
      { error: "Failed to update technology" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await deleteTechnology(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete technology:", error);
    return NextResponse.json(
      { error: "Failed to delete technology" },
      { status: 500 }
    );
  }
}
