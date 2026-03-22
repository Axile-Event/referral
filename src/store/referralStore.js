import toast from "react-hot-toast";
import { create } from "zustand";
import { referralApi } from "@/lib/api/referral";

/**
 * Referral Store (Zustand)
 *
 * State: referrals[], myReferralCode, totalEarnings, isLoading
 * Actions: fetchUserReferrals, generateReferralLink, trackReferralClick
 */
export const useReferralStore = create((set, get) => ({
  referrableEvents: [],
  referrals: [],
  myReferralCode: null,
  totalEarnings: 0,
  isLoading: false,

  fetchUserReferrals: async () => {
    set({ isLoading: true });
    try {
      // TODO: const data = await referralApi.getUserReferrals();
      // set({ referrals: data });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReferrableEvents: async () => {
    try {
      set({ isLoading: true });
      const data = await referralApi.getReferrableEvents();
      set({ referrableEvents: data });
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error("failed to fetch events that are up for referrals")
    } finally {
      set({ isLoading: false });
    }
  },

  generateReferralLink: async (eventId) => {
    // TODO: const link = await referralApi.generateLink(eventId);
    // return link;
    return "";
  },

  trackReferralClick: async (code, eventId) => {
    // TODO: await referralApi.trackClick(code, eventId);
  },
}));
