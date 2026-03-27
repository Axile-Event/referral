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
  referrals: [], // For legacy compatibility or general list
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
      // Doc: returns { "events": [...], "count": ... }
      const events = data.events || [];
      set({ referrableEvents: events });
      return events;
    } catch (error) {
      console.error("Failed to fetch referrable events:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchEventStats: async (eventId) => {
    try {
      set({ isLoading: true });
      const stats = await referralApi.getEventStats(eventId);
      // Doc: returns referral_name, referral_revenue, tickets_sold, tickets
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
      totalClicks: 0, // Backend docs don't show clicks yet
      totalTicketsSold: acc.totalTicketsSold + (curr.tickets_sold || 0),
      totalEarnings: acc.totalEarnings + (curr.referral_revenue || 0)
    }), { totalReferrals: 0, totalClicks: 0, totalTicketsSold: 0, totalEarnings: 0 });

    set({ stats: aggregated });
  },

  generateReferralLink: async (eventId) => {
    try {
      // Logic for building referral link based on doc section 8/9
      // Usually provided by backend or built manually?
      // Doc says: "Referral id is saved on each ticket..."
      // For now, assume generateLink endpoint still exists as a helper
      const res = await referralApi.generateLink(eventId);
      return res.link;
    } catch (error) {
      console.error("Failed to generate referral link:", error);
      return "";
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
