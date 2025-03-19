import mongoose, { Document, Schema } from "mongoose";

export interface IRawMaterial extends Document {
  name: string;
  category: string;
  unit: string;
  stock: number;
  label?: string;
  supplier: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const RawMaterialSchema = new Schema<IRawMaterial>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    label: { type: String },
    supplier: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

const RawMaterial =
  mongoose.models.RawMaterial || // Cek apakah model sudah ada
  mongoose.model<IRawMaterial>("RawMaterial", RawMaterialSchema);

export default RawMaterial;
