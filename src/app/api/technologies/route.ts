import { NextRequest, NextResponse } from "next/server";
import { getAllTechnologies, createTechnology } from "@/services/technology.service";

export async function GET() {
  try {
    const technologies = await getAllTechnologies();
    return NextResponse.json(technologies);
  } catch (error) {
    console.error("Failed to fetch technologies:", error);
    return NextResponse.json(
      { error: "Failed to fetch technologies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const technology = await createTechnology(data);
    return NextResponse.json(technology);
  } catch (error) {
    console.error("Failed to create technology:", error);
    return NextResponse.json(
      { error: "Failed to create technology" },
      { status: 500 }
    );
  }
}
