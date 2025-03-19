import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to mongodb");
    } catch (error) {
        console.log("Error " + error);
    }
}

export default connectDB;