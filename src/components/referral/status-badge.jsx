import React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * StatusBadge
 * 
 * lifecycle states:
 * clicked       → "Link opened"
 * initiated     → "Checkout started"
 * purchased     → "Payment initiated"
 * confirmed     → "Payment confirmed"
 * checked_in    → "Attended event"
 * rewarded      → "Points credited"
 */

const STATUS_CONFIG = {
  clicked: {
    label: "Link opened",
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  },
  initiated: {
    label: "Checkout started",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  purchased: {
    label: "Payment initiated",
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  confirmed: {
    label: "Payment confirmed",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  checked_in: {
    label: "Attended event",
    className: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  rewarded: {
    label: "Points credited",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
  },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status || "Unknown",
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase border",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
