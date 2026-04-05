"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User as UserIcon, Phone, AtSign, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input.jsx";
import { useAuthStore } from "@/store/authStore";
import {
  AuthSplitLayout,
  FormFieldError,
  AuthSubmitButton,
} from "@/components/auth/AuthLayout";

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1540575861501-7ce0e22042f9?q=80&w=2070&auto=format&fit=crop";
const BRAND_TEXT = "Start Your Earning Journey";
const BRAND_SUBTEXT =
  "Connect with top-tier events and be rewarded for sharing experiences with your network.";

export default function SignUpPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      toast.success("Signup successful. Check your email for the OTP verification code.");
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed. Please check your details and try again.");
    }
  };

  return (
    <AuthSplitLayout
      title="Create Account"
      subtitle="Be part of the Axile referral ecosystem"
      backgroundImage={BACKGROUND_IMAGE}
      brandText={BRAND_TEXT}
      brandSubtext={BRAND_SUBTEXT}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Input
              placeholder="First Name"
              icon={UserIcon}
              {...register("firstname", { required: "First name required" })}
              className={errors.firstname ? "border-red-500/50" : ""}
            />
            <FormFieldError error={errors.firstname} />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Last Name"
              icon={UserIcon}
              {...register("lastname", { required: "Last name required" })}
              className={errors.lastname ? "border-red-500/50" : ""}
            />
            <FormFieldError error={errors.lastname} />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Input
            placeholder="Username"
            icon={AtSign}
            {...register("username", { required: "Username required" })}
            className={errors.username ? "border-red-500/50" : ""}
          />
          <FormFieldError error={errors.username} />
        </div>

        {/* Email */}
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

        {/* Phone (Optional) */}
        <div className="space-y-2">
          <Input
            placeholder="Phone (Optional)"
            type="tel"
            icon={Phone}
            {...register("phone")}
          />
        </div>

        {/* Password */}
        <div className="space-y-2 relative">
          <Input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            {...register("password", {
              required: "Password required",
              minLength: { value: 8, message: "Min 8 characters" },
            })}
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

        {/* Submit Button */}
        <AuthSubmitButton isLoading={isLoading}>Register Now</AuthSubmitButton>
      </form>

      {/* Sign In Link */}
      <p className="text-center text-gray-400 font-medium">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-primary/80 font-bold transition-colors"
        >
          Sign In
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
