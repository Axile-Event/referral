"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { PinInputBox } from "@/components/ui/pin-input-box.jsx";
import { UserCircle, ShieldCheck, ArrowRight, CheckCircle2, X } from "lucide-react";
import { toast } from "react-hot-toast";

/**
 * GoogleOnboardingModal
 * Premium multi-step modal for username and PIN setup.
 * Required for Google OAuth users with incomplete profiles.
 */
export function GoogleOnboardingModal() {
  const { user, setUser } = useAuthStore();
  const { updateProfile, setPin, isLoading: storeLoading } = useUserStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Username, 2: PIN, 3: Success
  const [username, setUsername] = useState("");
  const [pin, setPinVal] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  // Determine if modal should show
  useEffect(() => {
    if (user && !user.username) {
      setIsOpen(true);
    }
  }, [user]);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    const updatedUser = await updateProfile({ username });
    if (updatedUser) {
      setUser(updatedUser);
      setStep(2);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }
    if (pin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    const success = await setPin(pin);
    if (success) {
      setStep(3);
      setTimeout(() => setIsOpen(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0a0a14]/90 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#12121f] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20"
        >
          {/* Close button (Cancel) */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-8 text-gray-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="p-10 pt-12 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6 ring-1 ring-primary/20">
                {step === 1 && <UserCircle size={40} />}
                {step === 2 && <ShieldCheck size={40} />}
                {step === 3 && <CheckCircle2 size={40} className="text-green-500" />}
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {step === 1 && "Finalize Your Profile"}
                {step === 2 && "Secure Your Account"}
                {step === 3 && "All Set!"}
              </h2>
              <p className="text-gray-400 text-base max-w-[280px] mx-auto">
                {step === 1 && "Pick a unique username to represent you on the platform."}
                {step === 2 && "Create a 4-digit PIN to secure your wallet and withdrawals."}
                {step === 3 && "Your profile has been successfully updated."}
              </p>
            </div>

            {step === 1 && (
              <form onSubmit={handleUsernameSubmit} className="space-y-6">
                <div className="relative">
                  <Input 
                    placeholder="Choose Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="h-16 rounded-2xl bg-white/5 border-white/10 text-xl text-center font-bold tracking-wide focus:border-primary px-4"
                  />
                  {error && <p className="text-red-400 text-sm mt-2 font-medium">{error}</p>}
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={storeLoading || username.length < 3}
                  className="w-full h-16 rounded-2xl text-lg font-bold group"
                >
                  {storeLoading ? "Saving..." : "Continue"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePinSubmit} className="space-y-8">
                <div className="flex flex-col items-center gap-6">
                  <div className="space-y-2">
                    <p className="text-xs uppercase font-bold tracking-widest text-primary/60">New PIN</p>
                    <PinInputBox 
                      value={pin}
                      onChange={(e) => setPinVal(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase font-bold tracking-widest text-primary/60">Confirm PIN</p>
                    <PinInputBox 
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={storeLoading || pin.length !== 4 || pin !== confirmPin}
                  className="w-full h-16 rounded-2xl text-lg font-bold"
                >
                  {storeLoading ? "Securing..." : "Complete Setup"}
                </Button>
              </form>
            )}

            {step === 3 && (
              <div className="py-8">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-primary font-bold text-xl"
                >
                  Redirecting to Dashboard...
                </motion.div>
              </div>
            )}

            <div className="mt-12 flex justify-center gap-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step === i ? "w-8 bg-primary" : "w-1.5 bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
