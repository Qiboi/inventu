import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    // Ambil data dari body request yang dikirim sebagai URL-encoded form data
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const email = params.get("email");
    const password = params.get("password");

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing email or password" },
        { status: 400 }
      );
    }

    const users = await User.find({});
    console.log("EMAIL : ", email);
    console.log("USERS : ", users);

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Bandingkan password yang diberikan dengan password yang sudah di-hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Jika otentikasi berhasil, kembalikan data user (pastikan data yang dikembalikan sesuai kebutuhan NextAuth)
    return NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
