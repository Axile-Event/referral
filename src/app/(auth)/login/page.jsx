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
        <div className="max-w-md w-full mx-auto space-y-12 animate-fade-in text-center lg:text-left">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-4 mx-auto lg:mx-0 animate-pulse">
               <Lock size={32} />
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">Login</h2>
            <p className="text-gray-400 font-medium">This page is currently under development.</p>
          </div>

          <div className="pt-8 w-full">
            <Link href="/dashboard">
              <Button size="lg" className="w-full h-14 rounded-2xl font-black text-base group">
                Go to Dashboard <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
