"use client";

import { useEffect, useCallback } from "react";
import { useReferralEntryStore } from "@/store/referralEntryStore";

/**
 * useReferralEntry hook
 *
 * Exposes referral entry state and actions.
 * Hydrates from localStorage on first mount and auto-clears expired entries.
 */
export function useReferralEntry() {
  const {
    referralCode,
    eventId,
    timestamp,
    setReferral,
    clearReferral,
    isExpired,
    hydrate,
  } = useReferralEntryStore();

  // Hydrate on mount (client-side only)
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Auto-clear if expired
  useEffect(() => {
    if (timestamp && isExpired()) {
      clearReferral();
    }
  }, [timestamp, isExpired, clearReferral]);

  const hasActiveReferral = useCallback(() => {
    return !!referralCode && !!eventId && !isExpired();
  }, [referralCode, eventId, isExpired]);

  return {
    referralCode,
    eventId,
    timestamp,
    setReferral,
    clearReferral,
    hasActiveReferral,
  };
}
