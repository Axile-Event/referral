"use client";

import React, { useRef, useEffect } from "react";

/**
 * PinInputBox - Visual PIN entry with 4 individual boxes
 * Displays PIN as individual digit boxes with mask for password
 */
export const PinInputBox = React.forwardRef(({ value = "", onChange, disabled, ...props }, ref) => {
  const inputRefs = useRef([]);
  
  const handleChange = (index, inputValue) => {
    const digit = inputValue.replace(/\D/g, ""); // Only digits
    
    if (digit.length > 1) {
      // If user pastes multiple digits, split them
      const digits = digit.slice(0, 4).split("");
      const newValue = digits.join("");
      onChange({ target: { value: newValue } });
      
      // Auto-focus last filled box or move to next available
      setTimeout(() => {
        const nextIndex = Math.min(digits.length, 3);
        inputRefs.current[nextIndex]?.focus();
      }, 0);
    } else {
      // Single digit entry
      const newValue = (value.slice(0, index) + digit + value.slice(index + 1)).slice(0, 4);
      onChange({ target: { value: newValue } });
      
      // Auto-advance to next box if digit entered
      if (digit && index < 3) {
        setTimeout(() => inputRefs.current[index + 1]?.focus(), 50);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      
      if (value[index]) {
        // If current box has value, clear it
        const newValue = value.slice(0, index) + value.slice(index + 1);
        onChange({ target: { value: newValue } });
        inputRefs.current[index]?.focus();
      } else if (index > 0) {
        // If current box is empty, move to previous and clear it
        const newValue = value.slice(0, index - 1) + value.slice(index);
        onChange({ target: { value: newValue } });
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="flex gap-2 justify-center" ref={ref}>
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="password"
          maxLength="1"
          inputMode="numeric"
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={handleFocus}
          disabled={disabled}
          className="w-14 h-14 text-center text-2xl font-bold border-2 border-white/10 rounded-lg bg-black/20 text-white placeholder:text-white/20 focus:border-primary focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          {...props}
        />
      ))}
    </div>
  );
});

PinInputBox.displayName = "PinInputBox";
