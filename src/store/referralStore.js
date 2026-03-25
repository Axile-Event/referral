import toast from "react-hot-toast";
import { create } from "zustand";
import { referralApi } from "@/lib/api/referral";

/**
 * Referral Store (Zustand)
 *
 * State: referrals[], referrableEvents, selectedEvent, myReferralCode, totalEarnings, isLoading
 * Actions: fetchUserReferrals, fetchReferrableEvents, fetchReferrableEventDetail, generateReferralLink, trackReferralClick
 */
export const useReferralStore = create((set, get) => ({
  referrableEvents: {
    events: [],
    count: 0
  },
  selectedEvent: null,
  referrals: [],
  myReferralCode: "",
  totalEarnings: 0,
  isLoading: false,

  fetchUserReferrals: async () => {
    try {
        set({ isLoading: true });
        const data = await referralApi.getUserReferrals();
        // Assuming /referrals returns an array or structured object
        set({ referrals: Array.isArray(data) ? data : data?.referrals || [] });
    } catch (error) {
        console.error("Fetch referrals error:", error);
        toast.error("Failed to load your active referrals");
    } finally {
        set({ isLoading: false });
    }
  },

  fetchReferrableEvents: async () => {
    try {
      set({ isLoading: true });
      const data = await referralApi.getReferrableEvents();
      // Data expected: { events: [], count: number }
      set({ 
        referrableEvents: {
            events: data?.events || [],
            count: data?.count || 0
        } 
      });
    } catch (error) {
      console.error("Fetch referrable events error:", error);
      toast.error("Failed to fetch events available for referrals");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReferrableEventDetail: async (identifier) => {
    try {
        set({ isLoading: true, selectedEvent: null });
        const data = await referralApi.getReferrableEventDetail(identifier);
        set({ selectedEvent: data });
        return data;
    } catch (error) {
        console.error("Fetch event detail error:", error);
        toast.error("Failed to load event details");
        return null;
    } finally {
        set({ isLoading: false });
    }
  },

  generateReferralLink: async (eventId) => {
    try {
        const data = await referralApi.generateLink(eventId);
        return data?.link || "";
    } catch (error) {
        toast.error("Failed to generate referral link");
        return "";
    }
  },

  trackReferralClick: async (code, eventId) => {
    try {
        await referralApi.trackClick(code, eventId);
    } catch (error) {
        console.error("Track click error:", error);
    }
  },
}));
