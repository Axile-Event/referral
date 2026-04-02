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
   * Aggregate stats from all known event campaigns for local calculation fallback.
   * This is used when the global stats endpoint is not ready.
   */
  calculateGlobalStats: () => {
    const { referrals } = get();
    
    const aggregated = referrals.reduce((acc, ref) => {
      // Use ref.stats which is returned by /referrals/ list
      const s = ref.stats || {};
      
      return {
        totalReferrals: acc.totalReferrals + 1,
        totalClicks: acc.totalClicks + (Number(s.clicks) || Number(ref.clicks) || 0),
        totalTicketsSold: acc.totalTicketsSold + (Number(s.tickets_sold) || Number(ref.tickets_sold) || 0),
        totalEarnings: acc.totalEarnings + (Number(s.revenue) || Number(s.total_earnings) || Number(ref.total_earnings) || 0)
      };
    }, { totalReferrals: 0, totalClicks: 0, totalTicketsSold: 0, totalEarnings: 0 });

    set({ stats: aggregated });
  },

  /**
   * Fetches global metrics from the backend for the main dashboard.
   */
  fetchGlobalStats: async () => {
    try {
      set({ isLoading: true });
      console.log("fetchGlobalStats: Fetching global referral metrics...");
      // If the dashboard metrics have their own endpoint /referrals/stats/
      const data = await referralApi.getStats();
      console.log("fetchGlobalStats: API Response:", data);
      
      set({ 
        stats: {
          totalReferrals: Number(data.total_referrals) || 0,
          totalClicks: Number(data.total_clicks) || 0,
          totalTicketsSold: Number(data.total_tickets_sold) || 0,
          totalEarnings: Number(data.total_earnings) || 0
        }
      });
      return data;
    } catch (error) {
      console.error("fetchGlobalStats failed, using local aggregate fallback.");
      // If the backend /referrals/stats/ is not ready, we rely on local aggregation from the /referrals/ list
      get().calculateGlobalStats();
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetches the programs the user is currently promoting.
   */
  fetchUserReferrals: async () => {
    try {
      set({ isLoading: true });
      console.log("fetchUserReferrals: Making API call to /referrals/...");
      const data = await referralApi.getUserReferrals();
      console.log("fetchUserReferrals: Data received successfully:", data);
      
      // Handle various response shapes if backend wrapped it
      const referralsArray = Array.isArray(data) ? data : (data?.referrals || data?.data || []);
      set({ referrals: referralsArray });
    } catch (error) {
      console.error("Referral Store execution failed [fetchUserReferrals]:", error);
      
      // Extract specific error info for more detailed logging
      const errorMsg = error?.response?.data?.message || error?.message || "Unknown error";
      const status = error?.response?.status;
      console.error(`API Error Detail: Status ${status}, Message: ${errorMsg}`);
      
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
