"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC } from "react";

interface SignUpFormProps extends React.ComponentProps<"form"> {
  onSwitchToLogin: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  error?: string;
}

export const SignUpForm: FC<SignUpFormProps> = ({
  className,
  onSwitchToLogin,
  onSubmit,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  ...props
}) => {
  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-[#2d3250]">
          Create Your Inventu Account
        </h1>
        <p className="text-sm text-gray-600">
          Sign up by filling out the information below.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username" className="text-[#2d3250]">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Your username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 focus:border-[#f9b17a] focus:ring-1 focus:ring-[#f9b17a]"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-[#2d3250]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 focus:border-[#f9b17a] focus:ring-1 focus:ring-[#f9b17a]"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password" className="text-[#2d3250]">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 focus:border-[#f9b17a] focus:ring-1 focus:ring-[#f9b17a]"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirm-password" className="text-[#2d3250]">
            Confirm Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 focus:border-[#f9b17a] focus:ring-1 focus:ring-[#f9b17a]"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-[#f9b17a] hover:bg-[#e8a066] text-white cursor-pointer transition-colors duration-300"
        >
          Sign Up
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#2d3250] underline underline-offset-4 hover:text-[#f9b17a] cursor-pointer"
        >
          Login
        </button>
      </div>
    </form>
  );
};
