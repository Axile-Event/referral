"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User as UserIcon, Phone, AtSign, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { GoogleSignupButton } from "@/components/auth/GoogleSignupButton.jsx";
import { useAuthStore } from "@/store/authStore";
import { parseApiError } from "@/lib/utils/errorParser";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SignUp Page
 * Premium design with split-screen layout and robust form handling.
 */
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
    }
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      toast.success("Signup successful. Check your email for the OTP verification code.");
      // Redirect to OTP verification page with email as query param
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      toast.error(parseApiError(error) || "Signup failed. Please check your details and try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a14] overflow-hidden">
      {/* Left Side: Dynamic Visual & Brand */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
          <Link href="/">
             <img 
                src="/axile-logo-main-cropped.png" 
                alt="Axile" 
                className="h-12 w-auto object-contain hover:scale-105 transition-transform"
              />
          </Link>

          <div className="space-y-6 max-w-lg mb-48">
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              Start <span className="text-primary">Making Money</span> Referring Others
            </motion.h1>
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-300 font-medium leading-relaxed"
            >
              Invite your network to exclusive events and earn rewards for every successful referral you make.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Right Side: Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-12 relative">
        <div className="max-w-[420px] w-full space-y-10">
          {/* Header */}
          <div className="text-center lg:text-left space-y-3">
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-6 mx-auto lg:mx-0 shadow-xl shadow-primary/10"
             >
                <UserIcon size={28} />
             </motion.div>
             <h2 className="text-4xl font-bold text-white tracking-tight">Join to Start Earning</h2>
             <p className="text-gray-400 font-medium">The platform where your network becomes your net worth.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input 
                  placeholder="First Name" 
                  icon={UserIcon}
                  {...register("firstname", { required: "First name is required" })}
                  className={errors.firstname ? "border-red-500/50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Input 
                  placeholder="Last Name" 
                  icon={UserIcon}
                  {...register("lastname", { required: "Last name is required" })}
                  className={errors.lastname ? "border-red-500/50" : ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Input 
                placeholder="Username" 
                icon={AtSign}
                {...register("username", { required: "Username is required" })}
                className={errors.username ? "border-red-500/50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Input 
                placeholder="Email Address" 
                type="email"
                icon={Mail}
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })}
                className={errors.email ? "border-red-500/50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Input 
                placeholder="Phone (Optional)" 
                type="tel"
                icon={Phone}
                {...register("phone")}
              />
            </div>

            <div className="space-y-2 relative">
              <Input 
                placeholder="Password" 
                type={showPassword ? "text" : "password"}
                icon={Lock}
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 8, message: "Min 8 characters" }
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

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 rounded-2xl font-bold text-base group mt-4 relative overflow-hidden"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Start Earning Now 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a14] px-4 text-gray-500 font-medium">Or create account with</span>
            </div>
          </div>

          <GoogleSignupButton variant="signup" />

          {/* Footer */}
          <p className="text-center text-gray-400 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[120px] -z-10" />
      </div>
    </div>
  );
}
