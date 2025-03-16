import connectDB from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB(); // Panggil fungsi koneksi database
        res.status(200).json({ success: true, message: "Database connected successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Database connection failed!", error: (error as Error).message });
    }
}
