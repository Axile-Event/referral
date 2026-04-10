"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input.jsx";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import {
  AuthSplitLayout,
  FormFieldError,
  AuthSubmitButton,
} from "@/components/auth/AuthLayout";

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop";
const BRAND_TEXT = "Sign In to Referral Dashboard";
const BRAND_SUBTEXT =
  "Access your rewards, track referrals, and find the best events.";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Login successful! Welcome back.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <AuthSplitLayout
      title="Login"
      subtitle="Enter your credentials to continue"
      backgroundImage={BACKGROUND_IMAGE}
      brandText={BRAND_TEXT}
      brandSubtext={BRAND_SUBTEXT}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Input
            placeholder="Email Address"
            type="email"
            icon={Mail}
            {...register("email", {
              required: "Email required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            className={errors.email ? "border-red-500/50" : ""}
          />
          <FormFieldError error={errors.email} />
        </div>

        {/* Password Field */}
        <div className="space-y-2 relative">
          <Input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            {...register("password", { required: "Password required" })}
            className={errors.password ? "border-red-500/50" : ""}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <FormFieldError error={errors.password} />
        </div>

        {/* Remember & Forgot Password */}
        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-white/10 bg-white/5 accent-primary cursor-pointer"
            />
            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <AuthSubmitButton isLoading={isLoading}>Sign In</AuthSubmitButton>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-gray-400 font-medium">
        New to Axile?{" "}
        <Link
          href="/signup"
          className="text-primary hover:text-primary/80 font-bold transition-colors"
        >
          Create Account
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
