import { create } from "zustand";

/**
 * Referral Store (Zustand)
 *
 * State: referrals[], myReferralCode, totalEarnings, isLoading
 * Actions: fetchUserReferrals, generateReferralLink, trackReferralClick
 *
 * TODO: Connect to referralApi
 */
export const useReferralStore = create((set, get) => ({
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

  generateReferralLink: async (eventId) => {
    // TODO: const link = await referralApi.generateLink(eventId);
    // return link;
    return "";
  },

  trackReferralClick: async (code, eventId) => {
    // TODO: await referralApi.trackClick(code, eventId);
  },
}));
