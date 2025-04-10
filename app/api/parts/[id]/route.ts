import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Part from "@/models/Part";

connectDB();

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> 
}) {
  try {
    const { id } = await params;
    const part = await Part.findById(id);   if (!part) {
      return NextResponse.json(
        { success: false, message: "Part not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: part });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch part", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> 
}) {
  try {
    const { id } = await params;
    const { name } =
      await req.json();

    const updated = await Part.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Part not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Part updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update part", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> 
}) {
  try {
    const { id } = await params;
    const deleted = await Part.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Part not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Part deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete part", error },
      { status: 500 }
    );
  }
}
