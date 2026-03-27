import { create } from "zustand";
import {
  REFERRAL_STORAGE_KEY,
  isReferralExpired,
} from "@/lib/utils/referral";

/**
 * Referral Entry Store (Zustand)
 *
 * Captures incoming referral link visits and persists to localStorage.
 * This is separate from the dashboard referralStore — this only handles
 * the visitor-side capture + redirect flow.
 *
 * State: referralCode, eventId, timestamp
 * Actions: setReferral, clearReferral, isExpired, hydrate
 */

function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (isReferralExpired(parsed.timestamp)) {
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
    return null;
  }
}

function saveToStorage(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — silent fail
  }
}

function removeFromStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
}

export const useReferralEntryStore = create((set, get) => ({
  referralCode: null,
  eventId: null,
  timestamp: null,

  /**
   * Save a referral entry. Latest click always wins (overrides previous).
   */
  setReferral: (code, eventId) => {
    const entry = {
      referralCode: code,
      eventId,
      timestamp: Date.now(),
    };
    saveToStorage(entry);
    set(entry);
  },

  /**
   * Clear referral data from both store and localStorage.
   */
  clearReferral: () => {
    removeFromStorage();
    set({ referralCode: null, eventId: null, timestamp: null });
  },

  /**
   * Check if current referral is expired.
   */
  isExpired: () => {
    const { timestamp } = get();
    return isReferralExpired(timestamp);
  },

  /**
   * Hydrate store from localStorage. Called once on app mount.
   * Auto-clears if expired.
   */
  hydrate: () => {
    const stored = loadFromStorage();
    if (stored) {
      set({
        referralCode: stored.referralCode,
        eventId: stored.eventId,
        timestamp: stored.timestamp,
      });
    } else {
      set({ referralCode: null, eventId: null, timestamp: null });
    }
  },
}));
