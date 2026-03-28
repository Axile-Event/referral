import { create } from "zustand";
import { referralApi } from "@/lib/api/referral";
import toast from "react-hot-toast";

/**
 * =========================================================================
 * Axile Referee Global Store
 * =========================================================================
 * Provides centralized context handling for Referral Campaigns, Event
 * details, and Wallet metrics. Acts as the Single Source of Truth for UIs.
 */

export const useReferralStore = create((set, get) => ({
  // -------------------------------------------------------------------------
  // GLOBAL STATE
  // -------------------------------------------------------------------------

  /** 
   * Events in the marketplace 
   * Format: { events: [], count: n } 
   */
  referrableEvents: { events: [], count: 0 },
  
  /** 
   * A single event opened on the detail page 
   */
  selectedEvent: null,
  
  /** 
   * The active user's generated tracking setups 
   */
  referrals: [],
  
  /** 
   * Global tracking stats & wallet summary
   */
  eventStats: {}, // Store stats by event_id: { [eventId]: stats }
  stats: {
    totalReferrals: 0,
    totalClicks: 0,
    totalTicketsSold: 0,
    totalEarnings: 0
  },
  
  isLoading: false,

  // -------------------------------------------------------------------------
  // ACTION METHODS
  // -------------------------------------------------------------------------

  /**
   * Fetches events that are open for referee promotion.
   */
  fetchReferrableEvents: async () => {
    try {
      set({ isLoading: true });
      const data = await referralApi.getReferrableEvents();
      // data format: { events: [], count: n }
      set({ referrableEvents: data || { events: [], count: 0 } });
      return data?.events || [];
    } catch (error) {
      console.error("Referral Store error [fetchReferrableEvents]:", error);
      toast.error("Failed to load events.", { 
        style: { background: "#161622", color: "#fff", border: "1px solid rgba(227, 54, 41, 0.2)" }
      });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetches the complete contextual detail of a specific referrable event.
   */
  fetchReferrableEventDetail: async (identifier) => {
    try {
      set({ isLoading: true, selectedEvent: null });
      const data = await referralApi.getEventDetail(identifier);
      set({ selectedEvent: data });
      return data;
    } catch (error) {
      console.error(`Referral Store error [fetchEventDetail for ${identifier}]:`, error);
      toast.error("Failed to load program details.", { 
        style: { background: "#161622", color: "#fff", border: "1px solid rgba(227, 54, 41, 0.2)" }
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetches the performance stats for a specific event campaign.
   */
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
   * Aggregate stats from all known event campaigns for the dashboard summary.
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

  /**
   * Fetches the programs the user is currently promoting.
   */
  fetchUserReferrals: async () => {
    try {
      set({ isLoading: true });
      const data = await referralApi.getUserReferrals();
      set({ referrals: data || [] });
    } catch (error) {
      console.error("Referral Store error [fetchUserReferrals]:", error);
      toast.error("Failed to load your referrals.", { 
        style: { background: "#161622", color: "#fff", border: "1px solid rgba(227, 54, 41, 0.2)" }
      });
    } finally {
        set({ isLoading: false });
    }
  },

  /**
   * Requests a new tracking payload/link for a specific event.
   */
  generateReferralLink: async (eventId) => {
    try {
      set({ isLoading: true });
      const res = await referralApi.generateLink(eventId);
      toast.success("Tracking link generated successfully!");
      return res;
    } catch (error) {
      console.error("Referral Store error [generateLink]:", error);
      toast.error("Failed to generate link.");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Pings tracking server when clicks occur.
   */
  trackReferralClick: async (code, eventId) => {
    try {
      await referralApi.trackClick(code, eventId);
    } catch (error) {
      console.error("Referral Store error [trackReferralClick]:", error);
    }
  },
}));
