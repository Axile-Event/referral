"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PinInputBox } from "@/components/ui/pin-input-box";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { UserCircle, Fingerprint, ArrowRight } from "lucide-react";

const toastTheme = {
  style: {
    background: "#161622",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    fontSize: "13px",
  },
};

/**
 * Setup Profile Page
 * Two-step onboarding for Google OAuth users:
 * Step 1: Set username
 * Step 2: Set PIN (4-digit code)
 * After completion, redirect to dashboard
 */
export default function SetupProfilePage() {
  const router = useRouter();
  const { user, authMethod } = useAuthStore();
  const { updateProfile, setPin, isLoading, fetchProfile } = useUserStore();
  
  const [step, setStep] = useState(1); // 1 = username, 2 = pin
  const [usernameVal, setUsernameVal] = useState("");
  const [pinData, setPinData] = useState({ pin: "", confirm: "" });
  const [usernameError, setUsernameError] = useState("");

  // Redirect if not a Google user or already authenticated with complete profile
  useEffect(() => {
    if (authMethod !== "google") {
      router.push("/dashboard");
    }
  }, [authMethod, router]);

  const onlyDigits = (v) => v.replace(/\D/g, "").slice(0, 4);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setUsernameError("");

    if (!usernameVal.trim()) {
      setUsernameError("Username is required");
      return;
    }

    if (usernameVal.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }

    try {
      await updateProfile({ username: usernameVal });
      toast.success("Username set successfully!", toastTheme);
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.username?.[0] || 
                  err.response?.data?.error || 
                  "Failed to set username";
      setUsernameError(msg);
      toast.error(msg, toastTheme);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();

    if (pinData.pin.length !== 4) {
      toast.error("PIN must be exactly 4 digits", toastTheme);
      return;
    }

    if (pinData.pin !== pinData.confirm) {
      toast.error("PINs do not match", toastTheme);
      return;
    }

    try {
      const success = await setPin(pinData.pin);
      if (success) {
        toast.success("PIN set successfully! Welcome to Axile.", toastTheme);
        // Redirect to dashboard after brief delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to set PIN";
      toast.error(msg, toastTheme);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-4 sm:p-6">
      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-3 tracking-tight">
            {step === 1 ? "Set Your Username" : "Set Your PIN"}
          </h1>
          <p className="text-white/50 text-sm sm:text-base font-normal">
            {step === 1
              ? "Choose a unique username for your Axile account"
              : "Create a secure 4-digit numeric code"}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1 flex-1 rounded-full transition-all ${step >= 1 ? "bg-primary" : "bg-white/10"}`} />
          <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-white/10"}`} />
        </div>

        {/* Form Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-[#12121f]/80 backdrop-blur-sm rounded-2xl border border-white/5 p-6 sm:p-7 shadow-lg"
        >
          {/* Step 1: Username */}
          {step === 1 && (
            <form onSubmit={handleUsernameSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <UserCircle size={18} />
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={usernameVal}
                    onChange={(e) => {
                      setUsernameVal(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
                      setUsernameError("");
                    }}
                    className="bg-black/20 border-white/5 h-12 rounded-xl pl-12 font-normal text-sm text-white focus:border-primary/50"
                    disabled={isLoading}
                  />
                </div>
                {usernameError && (
                  <p className="text-red-400 text-xs sm:text-sm font-normal mt-2">{usernameError}</p>
                )}
                <p className="text-white/40 text-xs sm:text-sm font-normal mt-3">
                  Lowercase letters, numbers, and underscores only • Minimum 3 characters
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !usernameVal.trim()}
                className="w-full h-12 rounded-xl font-semibold text-sm uppercase tracking-wide text-white transition-all bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? "Setting..." : "Continue"}
                {!isLoading && <ArrowRight size={16} />}
              </Button>
            </form>
          )}

          {/* Step 2: PIN */}
          {step === 2 && (
            <form onSubmit={handlePinSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white mb-4 text-center">
                  Enter Your PIN
                </label>
                <div className="space-y-3">
                  <PinInputBox 
                    value={pinData.pin}
                    onChange={(e) => setPinData({ ...pinData, pin: e.target.value })}
                    disabled={isLoading}
                  />
                  <div className="text-center text-xs text-white/40">
                    Enter the same 4-digit PIN below to confirm
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-4 text-center">
                  Confirm PIN
                </label>
                <div className="space-y-3">
                  <PinInputBox 
                    value={pinData.confirm}
                    onChange={(e) => setPinData({ ...pinData, confirm: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <p className="text-white/40 text-xs text-center py-2">
                Use a secure 4-digit numeric code
              </p>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="flex-1 h-11 rounded-xl font-semibold text-sm uppercase tracking-wide text-white transition-all bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || pinData.pin.length !== 4}
                  className="flex-1 h-11 rounded-xl font-semibold text-sm uppercase tracking-wide text-white transition-all bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? "Setting..." : "Complete"}
                  {!isLoading && <ArrowRight size={16} />}
                </Button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs sm:text-sm font-normal mt-8">
          {step === 1
            ? "You can change your username later in settings"
            : "Keep your PIN safe and secure"}
        </p>
      </motion.div>
    </div>
  );
}
