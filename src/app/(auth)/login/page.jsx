"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { GoogleSignupButton } from "@/components/auth/GoogleSignupButton.jsx";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Login Page
 * Premium design with split-screen layout and robust form handling.
 */
export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Login successful! Welcome back.");
      router.push("/dashboard");
    } catch (error) {
      const errorData = error.response?.data;
      const errorMsg = errorData?.detail || errorData?.error || errorData?.message || "";
      
      // If user is not verified, redirect to OTP page
      // Typical backend messages: "User is not active", "Account not verified", etc.
      if (
        errorMsg.toLowerCase().includes("verified") || 
        errorMsg.toLowerCase().includes("active") ||
        error.response?.status === 403
      ) {
        toast.error("Account not verified. Redirecting to verification page...");
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        }, 1500);
        return;
      }

      toast.error(errorMsg || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a14] overflow-hidden">
      {/* Left Side: Brand Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
           <Link href="/">
             <img 
                src="/axile-logo-main-cropped.png" 
                alt="Axile" 
                className="h-10 w-auto object-contain hover:grayscale-0 transition-all opacity-90"
              />
          </Link>
          
          <div className="space-y-6 max-w-lg mb-48">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-4 py-1 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm flex items-center gap-2"
            >
               <Sparkles size={14} className="text-primary" />
               <span className="text-sm font-bold text-gray-300">Welcome Back</span>
            </motion.div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
            >
              Sign In to <br />
              <span className="text-primary">Referral Dashboard</span>
            </motion.h1>
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-400 font-medium max-w-sm"
            >
              Access your rewards, track referrals, and find the best events.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-24 py-12 relative">
        <div className="max-w-[420px] w-full mx-auto space-y-10">
          <div className="space-y-3 text-center lg:text-left">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-6 mx-auto lg:mx-0 shadow-lg shadow-primary/5"
            >
               <Lock size={28} />
            </motion.div>
            <h2 className="text-4xl font-bold text-white tracking-tight">Login</h2>
            <p className="text-gray-400 font-medium">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Input 
                 placeholder="Email Address" 
                 type="email"
                 icon={Mail}
                 {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                 })}
                 className={errors.email ? "border-red-500/50 focus-visible:ring-red-500/50" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-xs px-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Input 
                 placeholder="Password" 
                 type={showPassword ? "text" : "password"}
                 icon={Lock}
                 {...register("password", { required: "Password is required" })}
                 className={errors.password ? "border-red-500/50 focus-visible:ring-red-500/50" : ""}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs px-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 accent-primary cursor-pointer" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors py-1">Remember me</span>
              </label>
              <Link href="/forgot-password" size="sm" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                 Forgot password?
              </Link>
            </div>

            <Button size="lg" className="w-full h-14 rounded-2xl font-bold text-base group mt-2" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a14] px-4 text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <GoogleSignupButton variant="login" />

          <div className="space-y-6 text-center">
            <p className="text-gray-400 font-medium">
              New to Axile?{" "}
              <Link href="/signup" className="text-primary hover:text-primary/80 font-bold transition-colors underline-offset-4 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[120px] -z-10" />
      </div>
    </div>
  );
}
