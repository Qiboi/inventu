import mongoose, { Document, Schema } from "mongoose";

export interface IPart extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const PartSchema = new Schema<IPart>(
    {
      name: { type: String, required: true },
    },
    { timestamps: true }    
);

const Part =
    mongoose.models.Part || // Cek apakah model sudah ada
    mongoose.model<IPart>("Part", PartSchema);

export default Part;
