"use client";

import { X, Gift } from "lucide-react";
import { useState } from "react";
import { useReferralEntry } from "@/lib/hooks/useReferralEntry";

/**
 * ReferralBanner (optional)
 *
 * Shows a subtle banner when the user has an active referral session.
 * Can be placed on any page to remind users they came via a referral link.
 */
export function ReferralBanner() {
  const { referralCode, hasActiveReferral } = useReferralEntry();
  const [dismissed, setDismissed] = useState(false);

  if (!hasActiveReferral() || dismissed) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
          <Gift size={16} />
        </div>
        <p className="text-sm text-gray-300">
          You were referred via code{" "}
          <span className="font-bold text-primary">{referralCode}</span>
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-gray-500 hover:text-white transition-colors shrink-0"
        aria-label="Dismiss banner"
      >
        <X size={16} />
      </button>
    </div>
  );
}
