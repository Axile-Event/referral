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
   * Expected format: { events: [], count: n } 
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
   * Global tracking stats 
   */
  myReferralCode: "",
  totalEarnings: 0,
  
  /** 
   * Global Loading Monitor for loaders/spinners 
   */
  isLoading: false,


  // -------------------------------------------------------------------------
  // ACTION METHODS
  // -------------------------------------------------------------------------

  /**
   * Fetches events that are open for referee promotion.
   * Required for the Marketplace List.
   */
  fetchReferrableEvents: async () => {
    try {
      set({ isLoading: true });
      const data = await referralApi.getReferrableEvents();
      set({ referrableEvents: data || { events: [], count: 0 } });
    } catch (error) {
      console.error("Referral Store error [fetchReferrableEvents]:", error);
      toast.error("An error occured while trying to load events.", { style: { background: "#161622", color: "#fff", border: "1px solid rgba(227, 54, 41, 0.2)" }});
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetches the complete contextual detail of a specific referrable event.
   * Required for the Detail/Checkout layout.
   * @param {string} identifier - unique ID or SLUG
   */
  fetchReferrableEventDetail: async (identifier) => {
    try {
      set({ isLoading: true, selectedEvent: null });
      const data = await referralApi.getReferrableEventDetail(identifier);
      set({ selectedEvent: data });
    } catch (error) {
      console.error(`Referral Store error [fetchEventDetail for ${identifier}]:`, error);
      toast.error("Failed to load program details.", { style: { background: "#161622", color: "#fff", border: "1px solid rgba(227, 54, 41, 0.2)" }});
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
      const data = await referralApi.getUserReferrals();
      set({ referrals: data || [] });
    } catch (error) {
      console.error("Referral Store error [fetchUserReferrals]:", error);
      toast.error("Failed to load your referrals.", { style: { background: "#161622", color: "#fff", border: "1px solid rgba(227, 54, 41, 0.2)" }});
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Requests a new tracking payload/link for a specific event
   * Does NOT alter state directly, returns target to component.
   */
  generateReferralLink: async (eventId) => {
    try {
      const res = await referralApi.generateLink(eventId);
      toast.success("Tracking link generated successfully!", { style: { background: "#161622", color: "#fff", border: "1px solid rgba(227, 54, 41, 0.2)" }});
      return res;
    } catch (error) {
      console.error("Referral Store error [generateLink]:", error);
      toast.error("Failed to generate link.", { style: { background: "#161622", color: "#fff", border: "1px solid rgba(227, 54, 41, 0.2)" }});
      return null;
    }
  },

  /**
   * Pings tracking server when clicks occur
   */
  trackReferralClick: async (code, eventId) => {
    try {
      await referralApi.trackClick(code, eventId);
    } catch (error) {
      console.error("Referral Store error [trackReferralClick]:", error);
    }
  },
}));
