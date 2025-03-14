import mongoose, { Document, Schema } from "mongoose";

interface IItem extends Document {
    name: string;
    quantity: number;
    createdAt: Date;
}

const ItemSchema: Schema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
})

const Item = mongoose.models?.Item || mongoose.model<IItem>("Item", ItemSchema);

export default Item;