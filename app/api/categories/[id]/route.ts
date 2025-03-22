import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

connectDB();

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> 
}) {
  try {
    const { id } = await params;
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch category", error },
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

    const updated = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Category updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update category", error },
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
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete category", error },
      { status: 500 }
    );
  }
}
