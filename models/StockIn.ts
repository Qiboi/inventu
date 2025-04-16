import mongoose, { Document, Schema } from "mongoose";

export interface IStockIn extends Document {
    product_id: mongoose.Schema.Types.ObjectId; // Referensi ke bahan baku
    quantity: number;
    draftIn: string;
    forceNumber: string;
    destinationLocation: string;
    doSupplierNo: string;
    forceDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const StockInSchema = new Schema<IStockIn>(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: { type: Number, required: true },
        draftIn: { type: String, required: true },
        forceNumber: { type: String, required: true },
        destinationLocation: { type: String, required: true },
        doSupplierNo: { type: String, required: true },
        forceDate: { type: Date, required: true },
    },
    { timestamps: true }
);

const StockIn =
    mongoose.models.StockIn || // Cek apakah model sudah ada
    mongoose.model<IStockIn>("StockIn", StockInSchema);

export default StockIn;
