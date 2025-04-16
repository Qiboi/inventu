import mongoose, { Document, Schema } from "mongoose";

export interface IStockOut extends Document {
    product_id: mongoose.Schema.Types.ObjectId; // Referensi ke bahan baku
    quantity: number;
    forceNumber: string;
    requestCenter: string;
    requestBy: string;
    transferDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const StockOutSchema = new Schema<IStockOut>(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: { type: Number, required: true },
        forceNumber: { type: String, required: true },
        requestCenter: { type: String, required: true },
        requestBy: { type: String, required: true },
        transferDate: { type: Date, required: true },
    },
    { timestamps: true }
);

const StockOut =
    mongoose.models.StockOut || // Cek apakah model sudah ada
    mongoose.model<IStockOut>("StockOut", StockOutSchema);

export default StockOut;
