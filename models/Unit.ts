import mongoose, { Document, Schema } from "mongoose";

export interface IUnit extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const UnitSchema = new Schema<IUnit>(
    {
      name: { type: String, required: true },
    },
    { timestamps: true }
);

const Unit =
    mongoose.models.Unit || // Cek apakah model sudah ada
    mongoose.model<IUnit>("Unit", UnitSchema);

export default Unit;
