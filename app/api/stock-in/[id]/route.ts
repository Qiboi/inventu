import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StockIn from "@/models/StockIn";

connectDB();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> 
}) {
  try {
    const { id } = await params;
    const stockIn = await StockIn.findById(id).populate("rawMaterial");

    if (!stockIn) {
      return NextResponse.json(
        { success: false, message: "Stock In data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: stockIn });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch stock-in data", error },
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
    const {
      product_id,
      quantity,
      draftIn,
      forceNumber,
      destinationLocation,
      doSupplierNo,
      forceDate,
    } = await req.json();

    const updatedStockIn = await StockIn.findByIdAndUpdate(
      id,
      {
        product_id,
        quantity,
        draftIn,
        forceNumber,
        destinationLocation,
        doSupplierNo,
        forceDate,
      },
      { new: true, runValidators: true }
    );

    if (!updatedStockIn) {
      return NextResponse.json(
        { success: false, message: "Stock In data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedStockIn,
      message: "Stock In updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update stock-in data", error },
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
    const deletedStockIn = await StockIn.findByIdAndDelete(id);

    if (!deletedStockIn) {
      return NextResponse.json(
        { success: false, message: "Stock In data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stock In deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete stock-in data", error },
      { status: 500 }
    );
  }
}
