import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Unit from "@/models/Unit";

connectDB();

export async function GET() {
  try {
    const units = await Unit.find();
    return NextResponse.json({ success: true, data: units });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch units", error },
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

    const newUnit = new Unit({
      name,
    });

    await newUnit.save();
    return NextResponse.json({
      success: true,
      data: newUnit,
      message: "Unit added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add unit", error },
      { status: 500 }
    );
  }
}
