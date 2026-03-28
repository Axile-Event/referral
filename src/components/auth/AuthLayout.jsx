"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Auth Split Layout Component
 * Reusable layout for auth pages (login, signup)
 */
export function AuthSplitLayout({
  children,
  title,
  subtitle,
  backgroundImage,
  brandText,
  brandSubtext,
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0a14] overflow-hidden">
      {/* Left Side: Brand Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
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

          <div className="space-y-6 max-w-lg mb-12">
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              {brandText}
            </motion.h1>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-300 font-medium leading-relaxed"
            >
              {brandSubtext}
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
              <Lock size={28} />
            </motion.div>
            <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
            <p className="text-gray-400 font-medium">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[120px] -z-10" />
      </div>
    </div>
  );
}

/**
 * Form Input Error Message Component
 */
export function FormFieldError({ error }) {
  if (!error) return null;
  return (
    <p className="text-red-500 text-xs px-1 font-medium">{error.message}</p>
  );
}

/**
 * Auth Submit Button Component
 */
export function AuthSubmitButton({ isLoading, children }) {
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full h-14 rounded-2xl font-bold text-base group mt-4"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          {children}
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </Button>
  );
}
