import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Part from "@/models/Part";

connectDB();

export async function GET() {
  try {
    const parts = await Part.find();
    return NextResponse.json({ success: true, data: parts });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch parts", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } =
      await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newPart = new Part({
      name,
    });

    await newPart.save();
    return NextResponse.json({
      success: true,
      data: newPart,
      message: "Part added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add part", error },
      { status: 500 }
    );
  }
}
