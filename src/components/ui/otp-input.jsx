"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Premium Segmented OTP Input
 * 
 * Uses a hidden numeric input for native behavior while rendering 
 * custom styles for each digit box.
 */
export const OTPInput = ({ 
  length = 6, 
  value = "", 
  onChange, 
  onComplete,
  disabled = false,
  error = false 
}) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Handle value change
  const handleChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    const truncatedVal = val.slice(0, length);
    
    onChange?.(truncatedVal);
    
    if (truncatedVal.length === length) {
      onComplete?.(truncatedVal);
    }
  };

  // Focus the hidden input when clicking on a box
  const handleBoxClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex items-center justify-center gap-2 sm:gap-4 w-full">
      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={length}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute inset-0 opacity-0 cursor-default"
        disabled={disabled}
      />

      {/* Visible boxes */}
      {Array.from({ length }).map((_, idx) => {
        const char = value[idx] || "";
        const isCurrent = isFocused && value.length === idx;
        const isFilled = value.length > idx;

        return (
          <div
            key={idx}
            onClick={handleBoxClick}
            className={cn(
              "w-12 h-14 sm:w-14 sm:h-16 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-200 cursor-text",
              // Base state
              "bg-white/5 border-white/10 text-white",
              // Current focus state
              isCurrent && "border-primary bg-primary/10 scale-105 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]",
              // Filled state
              isFilled && "border-white/20 text-white",
              // Error state
              error && "border-red-500/50 bg-red-500/5 text-red-500",
              // Disabled state
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {char}
            {/* Blinking cursor effect for current box */}
            {isCurrent && (
              <div className="absolute w-0.5 h-6 bg-primary animate-pulse rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
};
