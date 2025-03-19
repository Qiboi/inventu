import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import RawMaterial from "@/models/RawMaterial";

// Koneksi ke database
connectDB();

// GET: Ambil semua bahan baku & POST: Tambah bahan baku baru
export async function GET() {
  try {
    const rawMaterials = await RawMaterial.find();
    return NextResponse.json({ success: true, data: rawMaterials });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch raw materials", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, category, unit, stock, supplier, address, label } =
      await req.json();

    if (!name || !category || !unit || !stock || !supplier || !address) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newRawMaterial = new RawMaterial({
      name,
      category,
      unit,
      stock,
      supplier,
      address,
      label,
    });

    await newRawMaterial.save();
    return NextResponse.json({
      success: true,
      data: newRawMaterial,
      message: "Raw material added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add raw material", error },
      { status: 500 }
    );
  }
}
