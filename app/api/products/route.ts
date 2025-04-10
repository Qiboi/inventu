import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

connectDB();

export async function GET() {
  try {
    const products = await Product.find();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch products", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, part, category, unit, stock, minimum_stock, label, supplier, address } =
      await req.json();

    if (!name || !part || !category || !unit || !minimum_stock || !label || !supplier || !address) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newProduct = new Product({
      name,
      part,
      category,
      unit,
      stock,
      minimum_stock,
      label,
      supplier,
      address
    });

    await newProduct.save();
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add Product", error },
      { status: 500 }
    );
  }
}
