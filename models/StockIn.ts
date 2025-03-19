import mongoose, { Document, Schema } from "mongoose";

export interface IStockIn extends Document {
    rawMaterial: mongoose.Schema.Types.ObjectId; // Referensi ke bahan baku
    quantity: number;
    draftIn: string;
    forceNumber: string;
    supplier: string;
    address: string;
    destinationLocation: string;
    doSupplierNo: string;
    forceDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const StockInSchema = new Schema<IStockIn>(
    {
        rawMaterial: {
            type: Schema.Types.ObjectId,
            ref: "RawMaterial",
            required: true,
        },
        quantity: { type: Number, required: true },
        draftIn: { type: String, required: true },
        forceNumber: { type: String, required: true },
        supplier: { type: String, required: true },
        address: { type: String, required: true },
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
