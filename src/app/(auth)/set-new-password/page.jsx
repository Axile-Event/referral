"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input.jsx";
import { useAuthStore } from "@/store/authStore";
import {
  AuthSplitLayout,
  FormFieldError,
  AuthSubmitButton,
} from "@/components/auth/AuthLayout";
import Link from "next/link";

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop";
const BRAND_TEXT = "New Password";
const BRAND_SUBTEXT =
  "Almost there! Create a strong, unique password to complete your account recovery.";

function SetNewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";
  const { resetPassword, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    if (!email || !otp) {
      toast.error("Process data missing. Please restart from forgot password.");
      router.push("/forgot-password");
      return;
    }

    const uid = searchParams.get("uid") || "";
    const token = searchParams.get("token") || "";

    try {
      await resetPassword(email, otp, data.password, uid, token);
      toast.success("Success! Your password has been updated. You can now log in.");
      router.push("/login");
    } catch (error) {
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message;
      toast.error(serverMsg || "We couldn't update your password. Please try again.");
    }
  };

  return (
    <div className="w-full space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* New Password Field */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">
            Create Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              icon={KeyRound}
              {...register("password", {
                required: "A new password is required",
                minLength: { value: 8, message: "Use at least 8 characters" },
              })}
              className={errors.password ? "border-red-500/50" : ""}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <FormFieldError error={errors.password} />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat your password"
              icon={KeyRound}
              {...register("confirmPassword", {
                validate: (value) => value === password || "Passwords don't match",
              })}
              className={errors.confirmPassword ? "border-red-500/50" : ""}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <FormFieldError error={errors.confirmPassword} />
        </div>

        <AuthSubmitButton isLoading={isLoading}>
          Reset My Password
        </AuthSubmitButton>
      </form>

      <div className="text-center">
        <Link 
          href="/forgot-password"
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          Want to start over? <span className="text-primary font-bold">Restart</span>
        </Link>
      </div>
    </div>
  );
}

function SetNewPasswordFormWrapper() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <AuthSplitLayout
      title="Create New Password"
      subtitle={
        <div className="flex flex-col gap-1">
          <span>Final step to secure your account.</span>
          <span className="text-white/40 text-sm italic">
            Account: <span className="text-white font-bold">{email || "your email"}</span>
          </span>
        </div>
      }
      backgroundImage={BACKGROUND_IMAGE}
      brandText={BRAND_TEXT}
      brandSubtext={BRAND_SUBTEXT}
    >
      <SetNewPasswordContent />
    </AuthSplitLayout>
  );
}

export default function SetNewPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a14]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <SetNewPasswordFormWrapper />
    </Suspense>
  );
}
