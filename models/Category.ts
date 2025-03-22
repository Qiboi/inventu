import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
      name: { type: String, required: true },
    },
    { timestamps: true }
);

const Category =
    mongoose.models.Category || // Cek apakah model sudah ada
    mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
