import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StockIn from "@/models/StockIn";

connectDB();

export async function GET() {
  try {
    const stockInList = await StockIn.find().populate("rawMaterial");
    return NextResponse.json({ success: true, data: stockInList });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch stock-in data", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      rawMaterial,
      quantity,
      draftIn,
      forceNumber,
      supplier,
      address,
      destinationLocation,
      doSupplierNo,
      forceDate,
    } = await req.json();

    const newStockIn = new StockIn({
      rawMaterial,
      quantity,
      draftIn,
      forceNumber,
      supplier,
      address,
      destinationLocation,
      doSupplierNo,
      forceDate,
    });

    await newStockIn.save();

    // await RawMaterial.findByIdAndUpdate(rawMaterial, {
    //   $inc: { stock: quantity },
    // });

    return NextResponse.json({
      success: true,
      data: newStockIn,
      message: "Stock In added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add stock-in data", error },
      { status: 500 }
    );
  }
}
