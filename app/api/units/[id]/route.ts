import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Unit from "@/models/Unit";

connectDB();

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> 
}) {
  try {
    const { id } = await params;
    const unit = await Unit.findById(id);

    if (!unit) {
      return NextResponse.json(
        { success: false, message: "Unit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: unit });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch unit", error },
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

    const updated = await Unit.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Unit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Unit updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update unit", error },
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
    const deleted = await Unit.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Unit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Unit deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete unit", error },
      { status: 500 }
    );
  }
}
