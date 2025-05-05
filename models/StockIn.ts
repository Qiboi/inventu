import mongoose, { Document, Schema } from "mongoose";

export interface IStockInItem {
  product_id: mongoose.Schema.Types.ObjectId; // Referensi ke bahan baku
  quantity: number;
}

export interface IStockIn extends Document {
  items: IStockInItem[];
  draftIn: string;
  forceNumber: string;
  destinationLocation: string;
  doSupplierNo: string;
  forceDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StockInItemSchema = new Schema<IStockInItem>(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
  },
  { _id: false } // biar tiap item ga auto punya _id
);

const StockInSchema = new Schema<IStockIn>(
  {
    items: {
      type: [StockInItemSchema],
      required: true,
    },
    draftIn: { type: String, required: true },
    forceNumber: { type: String, required: true },
    destinationLocation: { type: String, required: true },
    doSupplierNo: { type: String, required: true },
    forceDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const StockIn =
  mongoose.models.StockIn || mongoose.model<IStockIn>("StockIn", StockInSchema);

export default StockIn;
