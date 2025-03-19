import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Gunakan import yang sudah dipisah

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };