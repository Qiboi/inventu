import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Mengambil data dari body JSON
    const body = await req.json();
    const { name, email, password, role, avatar } = body;

    // Validasi field wajib
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Cek apakah user dengan email yang sama sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password dengan bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Membuat user baru
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      avatar: avatar || "",
    });

    return NextResponse.json(
      { success: true, data: newUser },
      { status: 201 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error during sign up:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
