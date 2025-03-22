import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

connectDB();

export async function GET() {
  try {
    const categories = await Category.find();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories", error },
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

    const newCategory = new Category({
      name,
    });

    await newCategory.save();
    return NextResponse.json({
      success: true,
      data: newCategory,
      message: "Category added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add category", error },
      { status: 500 }
    );
  }
}
