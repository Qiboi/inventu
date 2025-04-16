import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StockOut from "@/models/StockOut";
import Product from "@/models/Product";

connectDB();

export async function GET() {
  try {
    const stockOutList = await StockOut.find().populate("product_id");
    return NextResponse.json({ success: true, data: stockOutList });
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
      forceNumber,
      requestCenter,
      transferDate,
      requestBy,
    } = await req.json();

    const newStockOut = new StockOut({
      product_id,
      quantity,
      forceNumber,
      requestCenter,
      transferDate,
      requestBy,
    });

    await newStockOut.save();

    await Product.findByIdAndUpdate(product_id, {
      $inc: { stock: -quantity },
    });

    return NextResponse.json({
      success: true,
      data: newStockOut,
      message: "Stock Out added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add stock-out data", error },
      { status: 500 }
    );
  }
}
