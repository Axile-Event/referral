"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Fingerprint, Loader2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { OTPInput } from "@/components/ui/otp-input";
import toast from "react-hot-toast";

const toastTheme = {
  style: {
    background: "#161622",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    fontSize: "13px",
  },
};

export function PinSetupModal({ isOpen, onClose }) {
  const { setPin, isLoading, user } = useAuthStore();
  const [step, setStep] = useState(1); // 1: Set, 2: Confirm
  const [pin, setPinVal] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState(false);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setPinVal("");
        setConfirmPin("");
        setError(false);
      }, 300);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (pin.length === 4) {
      setStep(2);
    } else {
      toast.error("Please enter a 4-digit PIN", toastTheme);
    }
  };

  const handleFinalSubmit = async (value) => {
    if (value !== pin) {
      setError(true);
      toast.error("PINs do not match. Try again.", toastTheme);
      setConfirmPin("");
      return;
    }

    const success = await setPin(pin);
    if (success) {
      toast.success("Security PIN activated!", toastTheme);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-start justify-center z-[101] p-4 pt-8 sm:pt-[30px] overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-[#0C0C14] border border-white/5 w-full max-w-[340px] rounded-[32px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] relative"
            >
              <div className="p-8 space-y-8 flex flex-col items-center">
                
                {/* Visual Indicator */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary relative z-10">
                    {step === 1 ? <Fingerprint size={32} /> : <Lock size={32} />}
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150" 
                  />
                </div>

                {/* Header Text */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {step === 1 ? "Set Security PIN" : "Confirm PIN"}
                  </h3>
                  <p className="text-gray-500 text-[13px] font-medium leading-relaxed max-w-[200px] mx-auto">
                    {step === 1 
                      ? "Create a 4-digit code to protect your withdrawals." 
                      : "Enter your PIN again to verify it is correct."}
                  </p>
                </div>

                {/* Segmented OTP-style Input */}
                <div className="w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ x: 10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -10, opacity: 0 }}
                      className="flex justify-center"
                    >
                      <OTPInput
                        length={4}
                        value={step === 1 ? pin : confirmPin}
                        onChange={step === 1 ? setPinVal : setConfirmPin}
                        onComplete={step === 1 ? handleNext : handleFinalSubmit}
                        error={error}
                        disabled={isLoading}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Step indicator */}
                <div className="flex gap-1.5">
                  <div className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step === 1 ? 'bg-primary' : 'bg-white/10'}`} />
                  <div className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step === 2 ? 'bg-primary' : 'bg-white/10'}`} />
                </div>

                {/* Actions */}
                <div className="w-full pt-2">
                  {step === 1 ? (
                    <Button 
                      disabled={pin.length < 4}
                      onClick={handleNext}
                      className="w-full h-12 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-sm tracking-wide transition-all active:scale-[0.98]"
                    >
                      Next Step <ArrowRight size={16} className="ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setStep(1)}
                      variant="ghost" 
                      className="w-full h-12 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 font-bold text-xs uppercase tracking-widest"
                    >
                      Wait, go back
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress/Success message */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-20">
                   <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                   <p className="text-xs font-bold text-white uppercase tracking-widest">Activating PIN...</p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
