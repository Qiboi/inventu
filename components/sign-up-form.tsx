import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FC } from "react";

interface SignUpFormProps extends React.ComponentProps<"form"> {
  onSwitchToLogin: () => void;
}

export const SignUpForm: FC<SignUpFormProps> = ({ className, onSwitchToLogin, ...props }) => {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
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
            className="border border-gray-300 focus:border-[#f9b17a] focus:ring-1 focus:ring-[#f9b17a]"
          />
        </div>
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
  )
}
