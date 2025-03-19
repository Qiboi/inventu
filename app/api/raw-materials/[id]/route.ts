import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import RawMaterial from "@/models/RawMaterial";

connectDB();

// GET: Ambil satu bahan baku berdasarkan ID
export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> 
}) {
  try {
    const { id } = await params;
    const rawMaterial = await RawMaterial.findById(id);

    if (!rawMaterial) {
      return NextResponse.json(
        { success: false, message: "Raw material not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rawMaterial });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch raw material", error },
      { status: 500 }
    );
  }
}

// PUT: Update bahan baku berdasarkan ID
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> 
}) {
  try {
    const { id } = await params;
    const { name, category, unit, stock, label } =
      await req.json();

    const updatedMaterial = await RawMaterial.findByIdAndUpdate(
      id,
      { name, category, unit, stock, label },
      { new: true, runValidators: true }
    );

    if (!updatedMaterial) {
      return NextResponse.json(
        { success: false, message: "Raw material not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMaterial,
      message: "Raw material updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update raw material", error },
      { status: 500 }
    );
  }
}

// DELETE: Hapus bahan baku berdasarkan ID
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> 
}) {
  try {
    const { id } = await params;
    const deletedMaterial = await RawMaterial.findByIdAndDelete(id);

    if (!deletedMaterial) {
      return NextResponse.json(
        { success: false, message: "Raw material not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Raw material deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete raw material", error },
      { status: 500 }
    );
  }
}
