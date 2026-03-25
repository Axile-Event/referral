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

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1516382640211-c1cae66b4bcc?q=80&w=2070&auto=format&fit=crop";
const BRAND_TEXT = "Recover Your Account";
const BRAND_SUBTEXT =
  "We'll send you a link to reset your password. Check your email and follow the instructions.";

/**
 * Forgot Password Page
 * Step 1: User enters email to receive reset link
 * Step 2: Backend sends reset link via email
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // TODO: Integrate with backend password reset endpoint once available
      // Expected API: POST /forgot-password/ with { email }
      // For now, simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success("Check your email for reset instructions");
    } catch (error) {
      toast.error(error?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  // Success State
  if (isSubmitted) {
    return (
      <AuthSplitLayout
        title="Email Sent"
        subtitle="Check your inbox for next steps"
        backgroundImage={BACKGROUND_IMAGE}
        brandText={BRAND_TEXT}
        brandSubtext={BRAND_SUBTEXT}
      >
        <div className="space-y-6">
          {/* Success Message */}
          <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30">
            <p className="text-sm text-green-400 font-medium">
              Password reset link sent to{" "}
              <span className="font-bold">{submittedEmail}</span>
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              What's next?
            </h3>
            <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the reset link in the email</li>
              <li>Enter your new password</li>
              <li>Sign in with your new password</li>
            </ol>
          </div>

          {/* Resend Button */}
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
          >
            Didn't receive link? Send again
          </button>

          {/* Back to Login */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 font-bold transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </AuthSplitLayout>
    );
  }

  // Form State
  return (
    <AuthSplitLayout
      title="Forgot Password?"
      subtitle="Enter your email to receive reset instructions"
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
        <p className="text-xs text-gray-500 px-1">
          We'll send a password reset link to your email. You can reset your password by clicking the link in the email.
        </p>

        {/* Submit Button */}
        <AuthSubmitButton isLoading={isLoading}>
          Send Reset Link
        </AuthSubmitButton>
      </form>

      {/* Back to Login */}
      <p className="text-center">
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
