import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StockIn from "@/models/StockIn";
import Product from "@/models/Product";

connectDB();

export async function GET() {
  try {
    const stockInList = await StockIn.find().populate("product_id");
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
      product_id,
      quantity,
      draftIn,
      forceNumber,
      destinationLocation,
      doSupplierNo,
      forceDate,
    } = await req.json();

    const newStockIn = new StockIn({
      product_id,
      quantity,
      draftIn,
      forceNumber,
      destinationLocation,
      doSupplierNo,
      forceDate,
    });

    await newStockIn.save();

    await Product.findByIdAndUpdate(product_id, {
      $inc: { stock: quantity },
    });

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
