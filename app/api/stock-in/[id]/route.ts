import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StockIn from "@/models/StockIn";
// import Product from "@/models/Product";

await connectDB();

// Helper untuk adjust stock
// async function adjustStock(productId: string, delta: number) {
//   await Product.findByIdAndUpdate(
//     productId,
//     { $inc: { stock: delta } },
//     { new: true }
//   );
// }

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stockIn = await StockIn.findById(id).populate("items.product_id");

    if (!stockIn) {
      return NextResponse.json(
        { success: false, message: "Stock In not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: stockIn });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch Stock In", error },
      { status: 500 }
    );
  }
}

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const {
//       items: newItems,
//       draftIn,
//       forceNumber,
//       destinationLocation,
//       doSupplierNo,
//       forceDate,
//     } = await req.json();

//     // Ambil dokumen lama
//     const old = await StockIn.findById(id);
//     if (!old) {
//       return NextResponse.json(
//         { success: false, message: "Stock In not found" },
//         { status: 404 }
//       );
//     }

//     // Revert stok lama
//     await Promise.all(
//       old.items.map(({ product_id, quantity }) =>
//         adjustStock(product_id.toString(), -quantity)
//       )
//     );

//     // Update StockIn
//     const updated = await StockIn.findByIdAndUpdate(
//       id,
//       { items: newItems, draftIn, forceNumber, destinationLocation, doSupplierNo, forceDate },
//       { new: true, runValidators: true }
//     ).populate("items.product_id");

//     // Apply stok baru
//     await Promise.all(
//       newItems.map(({ product_id, quantity }) =>
//         adjustStock(product_id, quantity)
//       )
//     );

//     return NextResponse.json({
//       success: true,
//       data: updated,
//       message: "Stock In updated and stocks adjusted",
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Failed to update", error },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const toDelete = await StockIn.findById(id);
//     if (!toDelete) {
//       return NextResponse.json(
//         { success: false, message: "Stock In not found" },
//         { status: 404 }
//       );
//     }

//     // Revert stok sebelum delete
//     await Promise.all(
//       toDelete.items.map(({ product_id, quantity }) =>
//         adjustStock(product_id.toString(), -quantity)
//       )
//     );

//     await StockIn.findByIdAndDelete(id);

//     return NextResponse.json({
//       success: true,
//       message: "Stock In deleted and stocks reverted",
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Failed to delete", error },
//       { status: 500 }
//     );
//   }
// }