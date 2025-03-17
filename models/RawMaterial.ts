import mongoose, { Document, Schema } from "mongoose";

export interface IRawMaterial extends Document {
  name: string;
  category: string;
  unit: string;
  stock: number;
  label?: string;
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
  },
  { timestamps: true }
);

const RawMaterial = mongoose.model<IRawMaterial>(
  "RawMaterial",
  RawMaterialSchema
);

export default RawMaterial;
