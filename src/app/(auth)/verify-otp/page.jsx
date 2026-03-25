"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { getErrorMessage } from "@/lib/utils/authError";
import { OTPInput } from "@/components/ui/otp-input.jsx";
import { Controller } from "react-hook-form";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { verifyOtp, isLoading } = useAuthStore();
  
  console.log("--- VerifyOtpPage Debug ---");
  console.log("Email from Search Params:", email);
  console.log("Full Search Params:", searchParams.toString());
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      otp: "",
    }
  });

  const onSubmit = async (data) => {
    if (!email) {
      toast.error("Email is missing. Please go back to signup.");
      return;
    }

    try {
      await verifyOtp(email, data.otp);
      toast.success("Account verified successfully! You can now login.");
      router.push("/login");
    } catch (error) {
      // Use central error handling for consistent messaging
      const errorMsg = getErrorMessage(error, "Verification failed. Please check your OTP and email.");
      toast.error(errorMsg);
      
      // Still log full error for debugging
      console.error("OTP Verification Error:", error);
    }
  };

  return (
    <div className="max-w-[420px] w-full space-y-10">
      <div className="text-center lg:text-left space-y-3">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-6 mx-auto lg:mx-0 shadow-xl shadow-primary/10"
        >
          <Lock size={28} />
        </motion.div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Verify Email</h2>
        <p className="text-gray-400 font-medium">
          We've sent a 6-digit code to <span className="text-white font-bold">{email || "your email"}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-400 text-center">
            Security Verification Code
          </label>
          
          <Controller
            name="otp"
            control={control}
            rules={{ 
              required: "OTP is required",
              minLength: { value: 6, message: "OTP must be 6 digits" }
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

          {errors.otp && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center font-bold"
            >
              {errors.otp.message}
            </motion.p>
          )}
        </div>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full h-14 rounded-2xl font-bold text-base group relative overflow-hidden"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Verify Account 
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      <div className="space-y-4 text-center">
        <p className="text-gray-400 font-medium text-sm">
          Didn't receive the code?{" "}
          <button className="text-primary hover:underline font-bold transition-all">
            Resend OTP
          </button>
        </p>
        <button 
          onClick={() => router.back()}
          className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
        >
          Back to Signup
        </button>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen bg-[#0a0a14] overflow-hidden">
      {/* Visual Side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        
        <div className="relative z-10 p-16 flex flex-col justify-end h-full">
           <img 
              src="/axile-logo-main-cropped.png" 
              alt="Axile" 
              className="h-10 w-auto object-contain mb-8 opacity-80"
            />
            <h3 className="text-2xl font-bold text-white mb-2">Security First</h3>
            <p className="text-gray-400 max-w-sm">We ensure your account is protected with multi-factor authentication.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-12 relative">
        <Suspense fallback={<Loader2 className="animate-spin text-primary" />}>
          <VerifyOtpForm />
        </Suspense>

        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px] -z-10" />
      </div>
    </div>
  );
}
