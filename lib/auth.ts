// lib/auth.ts
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Function to convert an object to URL-encoded form data
function toFormData(obj: Record<string, string>) {
  const formBody: string[] = [];
  for (const property in obj) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(obj[property]);
    formBody.push(`${encodedKey}=${encodedValue}`);
  }
  return formBody.join("&");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "m@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const data = {
          email: credentials.email,
          password: credentials.password,
          avatar: "/avatars/default.jpg",
        };
        const formData = toFormData(data);
        try {
          const res = await fetch(
            `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/login`,
            {
              method: "POST",
              body: formData,
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          );
          const resData = await res.json();
          if (res.ok && resData && resData.data) {
            return resData.data;
          } else {
            console.error("Authorization failed:", resData);
            return null;
          }
        } catch (error: unknown) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as unknown as User;
      return session;
    },
  },
};
