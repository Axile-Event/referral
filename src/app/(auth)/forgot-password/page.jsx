"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input.jsx";
import {
  AuthSplitLayout,
  FormFieldError,
  AuthSubmitButton,
} from "@/components/auth/AuthLayout";

import { useAuthStore } from "@/store/authStore";

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1516382640211-c1cae66b4bcc?q=80&w=2070&auto=format&fit=crop";
const BRAND_TEXT = "Recover Your Account";
const BRAND_SUBTEXT =
  "We'll send you a 6-digit code to reset your password. Check your email and enter the code on the next page.";

/**
 * Forgot Password Page
 * User enters email -> OTP sent to email -> Redirect to Reset Password (OTP)
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, isLoading } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      toast.success("Success! We've sent a 6-digit code to your email.");
      
      // Redirect to Reset Password page where they enter OTP and new password
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "We couldn't send the code. Please check your email and try again.");
    }
  };

  // Form State
  return (
    <AuthSplitLayout
      title="Forgot Password?"
      subtitle="Enter your email to receive a recovery code"
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

        {/* Info Text */}
        <p className="text-xs text-gray-500 px-1 italic">
          We'll send a 6-digit security code to your email. You can reset your password on the next screen.
        </p>

        {/* Submit Button */}
        <AuthSubmitButton isLoading={isLoading}>
          Send Recovery Code
        </AuthSubmitButton>
      </form>

      {/* Back to Login */}
      <p className="text-center mt-6">
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
