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
  referrals: [], // Active campaigns/links
  myReferralCode: "",
  totalEarnings: 0,
  eventStats: {}, // Store stats by event_id: { [eventId]: stats }
  stats: {
    totalReferrals: 0,
    totalClicks: 0,
    totalTicketsSold: 0,
    totalEarnings: 0
  },
  isLoading: false,

  fetchReferrableEvents: async () => {
    try {
      set({ isLoading: true });
      const data = await referralApi.getReferrableEvents();
      // Handle response as { events: [...] } or direct array [...]
      const events = Array.isArray(data) ? data : (data.events || []);
      set({ referrableEvents: events });
      return events;
    } catch (error) {
      console.error("Failed to fetch referrable events:", error);
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserReferrals: async () => {
    try {
      set({ isLoading: true });
      const data = await referralApi.getUserReferrals();
      set({ referrals: data || [] });
      return data || [];
    } catch (error) {
      console.error("Failed to fetch user referrals:", error);
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  fetchEventStats: async (eventId) => {
    try {
      set({ isLoading: true });
      const stats = await referralApi.getEventStats(eventId);
      set((state) => ({
        eventStats: {
          ...state.eventStats,
          [eventId]: stats
        }
      }));
      return stats;
    } catch (error) {
      console.error(`Failed to fetch stats for event ${eventId}:`, error);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Aggregate stats from all known event campaigns
   */
  calculateGlobalStats: () => {
    const { eventStats } = get();
    const statsArray = Object.values(eventStats);
    
    const aggregated = statsArray.reduce((acc, curr) => ({
      totalReferrals: acc.totalReferrals + (curr.tickets_sold > 0 ? 1 : 0),
      totalClicks: 0,
      totalTicketsSold: acc.totalTicketsSold + (curr.tickets_sold || 0),
      totalEarnings: acc.totalEarnings + (curr.referral_revenue || 0)
    }), { totalReferrals: 0, totalClicks: 0, totalTicketsSold: 0, totalEarnings: 0 });

    set({ stats: aggregated });
  },

  generateReferralLink: async (eventId) => {
    try {
      set({ isLoading: true });
      const res = await referralApi.generateLink(eventId);
      toast.success("Referral link generated!");
      return res.link;
    } catch (error) {
      console.error("Failed to generate referral link:", error);
      toast.error("Failed to generate link.");
      return "";
    } finally {
      set({ isLoading: false });
    }
  },

  trackReferralClick: async (code, eventId) => {
    try {
      await referralApi.trackClick(code, eventId);
    } catch (error) {
       // Silent fail for tracking
    }
  },
}));
