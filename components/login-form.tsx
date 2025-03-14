import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FC } from "react";

interface LoginFormProps extends React.ComponentProps<"form"> {
  onSwitchToSignUp: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ className, onSwitchToSignUp, ...props }) => {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-[#2d3250]">
          Login to Inventu
        </h1>
        <p className="text-sm text-gray-600">
          Enter your email and password below to access your internal dashboard.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-[#2d3250]">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            className="border border-gray-300 focus:border-[#f9b17a] focus:ring-1 focus:ring-[#f9b17a]"
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[#2d3250]">Password</Label>
            <a
              href="#"
              className="text-sm text-[#2d3250] underline underline-offset-4 hover:text-[#f9b17a]"
            >
              Forgot your password?
            </a>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="Your password"
            required 
            className="border border-gray-300 focus:border-[#f9b17a] focus:ring-1 focus:ring-[#f9b17a]"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-[#f9b17a] hover:bg-[#e8a066] text-white cursor-pointer transition-colors duration-300"
        >
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-[#2d3250] underline underline-offset-4 hover:text-[#f9b17a] cursor-pointer"
        >
          Sign up
        </button>
      </div>
    </form>
  )
}
