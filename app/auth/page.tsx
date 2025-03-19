"use client";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { SignUpForm } from "@/components/sign-up-form";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function AuthPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // State untuk SignUpForm
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    console.log("EMAIL : ", email)
    const result = await signIn("credentials", {
      redirect: false,
      email: email, // Menggunakan email sebagai username
      password,
      callbackUrl: "/dashboard",
    });
    console.log("SignIn result:", result);
    if (result?.ok) {
      toast.success("Logged In successfully!");
      window.location.href = result.url || "/dashboard";
    } else {
      toast.error("Login failed!");
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }
    setSignupError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupUsername,
          email: signupEmail,
          password: signupPassword,
          role: "user",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Auto-login setelah sign up
        const result = await signIn("credentials", {
          redirect: false,
          email: signupEmail,
          password: signupPassword,
          callbackUrl: "/dashboard",
        });
        if (result?.ok) {
          toast.success("Signed Up successfully!");
          window.location.href = result.url || "/dashboard";
        }
      } else {
        toast.error("Sign Up failed!");
        setSignupError(data.message || "Sign up failed");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSignupError(error.message);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            aria-label="Go to homepage"
            className="flex items-center gap-2 font-medium"
          >
            <Image
              src="/image/logo.png"
              alt="Inventu Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {isLogin ? (
              <LoginForm
                onSwitchToSignUp={() => setIsLogin(false)}
                onSubmit={handleSubmit}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            ) : (
              <SignUpForm
                onSwitchToLogin={() => setIsLogin(true)}
                onSubmit={handleSignUpSubmit}
                username={signupUsername}
                setUsername={setSignupUsername}
                email={signupEmail}
                setEmail={setSignupEmail}
                password={signupPassword}
                setPassword={setSignupPassword}
                confirmPassword={signupConfirmPassword}
                setConfirmPassword={setSignupConfirmPassword}
                error={signupError}
              />
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/image/image.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={900}
          height={900}
          priority
        />
      </div>
    </div>
  );
}
