import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StockIn from "@/models/StockIn";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();

  try {
    const stockInList = await StockIn.find()
    .populate({
      path: "items.product_id", // Populasi field product_id dalam items
      select: "name label unit supplier address" // Pilih field yang relevan
    })
      .lean(); // Menggunakan lean untuk mendapatkan objek JavaScript biasa

    // console.log(JSON.stringify(stockInList, null, 2));
    return NextResponse.json({ success: true, data: stockInList });
  } catch (error) {
    console.error("GET Stock-In error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const {
      items,
      draftIn,
      forceNumber,
      destinationLocation,
      doSupplierNo,
      forceDate,
    } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "`items` array is required" },
        { status: 400 }
      );
    }

    // Simpan stock-in
    const newStockIn = await StockIn.create({
      items,
      draftIn,
      forceNumber,
      destinationLocation,
      doSupplierNo,
      forceDate,
    });

    // Untuk tiap item, increment stock di Product
    await Promise.all(
      items.map(({ product_id, quantity }) =>
        Product.findByIdAndUpdate(
          product_id,
          { $inc: { stock: quantity } },
          { new: true }
        )
      )
    );

    return NextResponse.json(
      { success: true, data: newStockIn, message: "Stock In added and products updated" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/stock-in:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error },
      { status: 500 }
    );
  }
}