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
  stats: {
    totalReferrals: 0,
    totalClicks: 0,
    totalTicketsSold: 0,
    totalEarnings: 0
  },
  myReferralCode: "",
  totalEarnings: 0,
  isLoading: false,

  fetchUserReferrals: async () => {
    try {
      set({ isLoading: true });
      const data = await referralApi.getUserReferrals();
      set({ referrals: data });
    } catch (error) {
      console.error("Failed to fetch user referrals:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      set({ isLoading: true });
      const data = await referralApi.getStats();
      set({ 
        stats: data, 
        totalEarnings: data.totalEarnings 
      });
    } catch (error) {
      console.error("Failed to fetch referral stats:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReferrableEvents: async () => {
    try {
      set({ isLoading: true });
      const data = await referralApi.getReferrableEvents();
      // data might be { events: [...] } or just [...]
      const events = Array.isArray(data) ? data : (data.events || []);
      set({ referrableEvents: events });
    } catch (error) {
      console.error("Failed to fetch referrable events:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  generateReferralLink: async (eventId) => {
    try {
      const res = await referralApi.generateLink(eventId);
      return res.link;
    } catch (error) {
      toast.error("Failed to generate referral link");
      return "";
    }
  },

  trackReferralClick: async (code, eventId) => {
    try {
      await referralApi.trackClick(code, eventId);
    } catch (error) {
      console.error("Failed to track referral click:", error);
    }
  },
}));
