import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { data } = await req.json();

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        const inserted = await Product.insertMany(data);
        return NextResponse.json({ message: "Success", count: inserted.length });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}