"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { cn } from "@/lib/utils/cn.js";

/**
 * Login Page
 * Matches the Axile split-screen layout (Image 4).
 */
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("user"); // "user" | "organizer"

  return (
    <div className="flex min-h-screen bg-[#0a0a14]">
      {/* Left Side: Image & Welcome (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 scale-110 hover:scale-100 transition-transform duration-[10s]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent" />
        
        <div className="relative z-10 p-16 flex flex-col justify-end h-full">
          <div className="space-y-4 max-w-lg">
            <img 
              src="/axile-logo-main-cropped.png" 
              alt="Axile" 
              className="h-16 w-auto object-contain mb-4"
            />
            <h1 className="text-6xl font-extrabold text-white tracking-tight leading-tight">
              Welcome to the <span className="text-primary">Referral System</span>
            </h1>
            <p className="text-xl text-gray-200 font-medium">
              Discover amazing events and create unforgettable experiences
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-12 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-gray-400">Sign in to get your tickets</p>
          </div>

          {/* User Type Toggle */}
          <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl w-full">
            <button
              onClick={() => setUserType("user")}
              className={cn(
                "flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                userType === "user" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white"
              )}
            >
              User
            </button>
            <button
              onClick={() => setUserType("organizer")}
              className={cn(
                "flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                userType === "organizer" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white"
              )}
            >
              Organizer
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <Input 
                type="email" 
                placeholder="Axile.nig@gmail.com" 
                icon={Mail}
                className="group-focus-within:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  icon={Lock}
                  className="pr-12 group-focus-within:border-primary/50"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button className="w-full group">
              Sign In <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline tracking-tight">
              Create an account
            </Link>
          </p>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a14] px-4 text-gray-500 tracking-widest">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full border-white/10 hover:border-white/20 bg-white/5">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-3 grayscale hover:grayscale-0 transition-all" alt="Google" />
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
