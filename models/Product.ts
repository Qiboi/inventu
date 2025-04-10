import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    part: string;
    category: string;
    unit: string;
    stock: number;
    minimum_stock: number;
    label: string;
    supplier: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
      name: { type: String, required: true },
      part: { type: String, required: true },
      category: { type: String, required: true },
      unit: { type: String, required: true },
      stock: { type: Number, required: true, default: 0 },
      minimum_stock: { type: Number, required: true, default: 0 },
      supplier: { type: String, required: true },
      address: { type: String, required: true },
      label: { type: String, required: true },
    },
    { timestamps: true }
);

const Product =
    mongoose.models.Product || // Cek apakah model sudah ada
    mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
