"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, Loader2, Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input.jsx";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { OTPInput } from "@/components/ui/otp-input.jsx";
import {
  AuthSplitLayout,
  FormFieldError,
  AuthSubmitButton,
} from "@/components/auth/AuthLayout";
import Link from "next/link";

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop";
const BRAND_TEXT = "Secure Reset";
const BRAND_SUBTEXT =
  "Enter the 6-digit code we sent you and create a strong new password for your account.";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { forgotPassword, verifyResetOtp, isLoading } = useAuthStore();
  const [resendTimer, setResendTimer] = useState(0);

  // Cooldown logic (same as verify-otp)
  const startCooldown = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is missing. Please restart the process.");
      return;
    }
    try {
      await forgotPassword(email);
      toast.success("A new code is on its way to your inbox!");
      startCooldown();
    } catch (error) {
      toast.error(error.response?.data?.message || "We couldn't resend the code. Please try again in a moment.");
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data) => {
    if (!email) {
      toast.error("Email is missing. Please restart the process.");
      return;
    }

    try {
      // Step 1: Validate OTP with backend
      const res = await verifyResetOtp(email, data.otp);
      
      toast.success("Identity confirmed! Now, let's create a new password.");
      
      // Some backends return uid/token after OTP verification
      const uid = res?.uid || res?.UID || "";
      const token = res?.token || res?.Token || "";
      
      router.push(`/set-new-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(data.otp)}&uid=${uid}&token=${token}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid code. Please double-check the email we sent you.");
    }
  };

  return (
    <div className="w-full space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* OTP Input Section ONLY */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider text-center">
            Verification Code
          </label>
          <Controller
            name="otp"
            control={control}
            rules={{
              required: "Code is required",
              minLength: { value: 6, message: "Code must be 6 digits" },
            }}
            render={({ field }) => (
              <OTPInput
                length={6}
                value={field.value}
                onChange={field.onChange}
                disabled={isLoading}
                error={!!errors.otp}
              />
            )}
          />
          <FormFieldError error={errors.otp} />
        </div>

        <AuthSubmitButton isLoading={isLoading}>
          Verify Code
        </AuthSubmitButton>
      </form>

      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-400 font-medium">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading || resendTimer > 0}
            className={`font-bold transition-all ${resendTimer > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-primary hover:underline'}`}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
          </button>
        </p>
        
        <Link 
          href="/login"
          className="block text-gray-500 hover:text-white text-sm font-medium transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

function ResetPasswordFormWrapper() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <AuthSplitLayout
      title="Reset Password"
      subtitle={
        <div className="flex flex-col gap-1">
          <span>Complete the verification to secure your account.</span>
          <span className="text-white/40 text-sm">
            Sent to: <span className="text-white font-bold">{email || "your email"}</span>
          </span>
        </div>
      }
      backgroundImage={BACKGROUND_IMAGE}
      brandText={BRAND_TEXT}
      brandSubtext={BRAND_SUBTEXT}
    >
      <ResetPasswordContent />
    </AuthSplitLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a14]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <ResetPasswordFormWrapper />
    </Suspense>
  );
}
