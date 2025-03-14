"use client";
import Image from "next/image";
import { LoginForm } from "@/components/login-form"
import Link from "next/link";
import { SignUpForm } from "@/components/sign-up-form";
import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" aria-label="Go to homepage" className="flex items-center gap-2 font-medium">
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
          {/* <div className="flex flex-col"> */}
            {/* <div className="flex space-x-4 mb-6 justify-center">
              <button
                onClick={() => setIsLogin(true)}
                className={`font-medium transition-colors duration-300 ${isLogin ? "text-[#f9b17a]" : "text-[#2d3250]"
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`font-medium transition-colors duration-300 ${!isLogin ? "text-[#f9b17a]" : "text-[#2d3250]"
                  }`}
              >
                Sign Up
              </button>
            </div> */}
            <div className="w-full max-w-xs">
              {isLogin ? (
                <LoginForm onSwitchToSignUp={() => setIsLogin(false)} />
              ) : (
                <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
              )}
            </div>
          {/* </div> */}
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/image/image.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={900}
          height={900}
        />
      </div>
    </div>
  )
}
