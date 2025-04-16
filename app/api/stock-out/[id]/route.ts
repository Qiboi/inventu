import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StockOut from "@/models/StockOut";

connectDB();

export async function GET(
    req: NextRequest,
    { params }: {
        params: Promise<{ id: string }>
    }) {
    try {
        const { id } = await params;
        const stockOut = await StockOut.findById(id).populate("product_id");

        if (!stockOut) {
            return NextResponse.json(
                { success: false, message: "Stock Out data not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: stockOut });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch stock-out data", error },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: {
        params: Promise<{ id: string }>
    }) {
    try {
        const { id } = await params;
        const {
            product_id,
            quantity,
            forceNumber,
            requestCenter,
            transferDate,
            requestBy,
        } = await req.json();

        const updatedStockOut = await StockOut.findByIdAndUpdate(
            id,
            {
                product_id,
                quantity,
                forceNumber,
                requestCenter,
                transferDate,
                requestBy,
            },
            { new: true, runValidators: true }
        );

        if (!updatedStockOut) {
            return NextResponse.json(
                { success: false, message: "Stock Out data not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: updatedStockOut,
            message: "Stock Out updated successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to update stock-out data", error },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: {
        params: Promise<{ id: string }>
    }) {
    try {
        const { id } = await params;
        const deletedStockOut = await StockOut.findByIdAndDelete(id);

        if (!deletedStockOut) {
            return NextResponse.json(
                { success: false, message: "Stock Out data not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Stock Out deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete stock-out data", error },
            { status: 500 }
        );
    }
}
