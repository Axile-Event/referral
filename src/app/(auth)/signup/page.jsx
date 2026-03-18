"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { cn } from "@/lib/utils/cn.js";

/**
 * SignUp Page
 * Matches the Axile split-screen layout (Image 4 style).
 */
export default function SignUpPage() {
  const [userType, setUserType] = useState("user"); // "user" | "organizer"

  return (
    <div className="flex min-h-screen bg-[#0a0a14]">
      {/* Left Side: Image & Welcome (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 scale-110 hover:scale-100 transition-transform duration-[10s]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575861501-7ce0e22042f9?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent" />
        
        <div className="relative z-10 p-16 flex flex-col justify-end h-full">
          <div className="space-y-4 max-w-lg">
            <h1 className="text-6xl font-extrabold text-white tracking-tight leading-tight">
              Join <span className="text-primary">Axile</span>
            </h1>
            <p className="text-xl text-gray-200 font-medium">
              Start earning by referring the best events to your community
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: SignUp Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-12 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-gray-400">Join the Axile referral ecosystem</p>
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
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <Input 
                type="text" 
                placeholder="John Doe" 
                icon={User}
                className="group-focus-within:border-primary/50"
              />
            </div>

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
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••••••" 
                icon={Lock}
                className="group-focus-within:border-primary/50"
              />
            </div>

            <Button className="w-full group">
              Create Account <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline tracking-tight">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
