import connectDB from "@/lib/db";
import Item from "@/models/Item";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Pastikan sudah terkoneksi ke MongoDB
    await connectDB();

    if (req.method === "GET") {
        // Mengambil semua data Item
        try {
            const items = await Item.find();
            return res.status(200).json({ success: true, data: items });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    } else if (req.method === "POST") {
        // Menambahkan data Item baru
        try {
            const newItem = await Item.create(req.body);
            return res.status(201).json({ success: true, data: newItem });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    } else {
        // Method selain GET dan POST tidak diizinkan
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
}
