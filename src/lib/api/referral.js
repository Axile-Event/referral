import apiClient from "./client";

/**
 * Referral API Service
 * Handles all backend HTTP communication for the referral system.
 * Aligned with API_DOCUMENTATION.MD and backend pathing.
 */
export const referralApi = {
  // ==========================================
  // REFEREE MARKETPLACE (Events)
  // ==========================================

  /**
   * Fetches all events that allow referrals (`use_referral: true`)
   */
  getReferrableEvents: () => 
    apiClient.get("/referee/events/").then((res) => res.data),
  
  /**
   * Fetches detailed data for a specific referrable event.
   */
  getEventDetails: (identifier) => 
    apiClient.get(`/referee/events/${identifier}/`).then((res) => res.data),

  /**
   * GET /referee/<event_id>/stats/ — Individual program metrics and ticket history.
   * This is the primary source of stats for the referee.
   */
  getEventStats: (eventId) => 
    apiClient.get(`/referee/${eventId}/stats/`).then((res) => res.data),

  // ==========================================
  // REFERRALS & TRACKING
  // ==========================================

  /**
   * Fetches the programs the user is currently promoting.
   */
  getUserReferrals: () =>
    apiClient.get("/referrals/").then((res) => res.data),

  /**
   * GET /referrals/stats/ — Global summary statistics.
   * NOTE: Backend endpoint is not currently ready.
   */
  getStats: () =>
    apiClient.get("/referrals/stats/").then((res) => res.data),

  /**
   * POST /referrals/generate/ — Requests a new tracking code/link.
   */
  generateLink: (eventId) =>
    apiClient.post("/referrals/generate/", { event_id: eventId }).then((res) => res.data),

  /**
   * POST /referral/click/ — Logs a click for the tracking system.
   */
  trackClick: (code, eventId) =>
    apiClient.post("/referral/click/", { ref_code: code, event_id: eventId }).then((res) => res.data),
};

/**
 * trackReferralClick(code, eventId) helper
 * Logs a click for the referral system.
 * Uses fire-and-forget logic with silent failure.
 */
export const trackReferralClick = async (code, eventId) => {
  try {
    // Note: Singular /referral/click/ as per production spec
    await apiClient.post("/referral/click/", {
      ref_code: code,
      event_id: eventId,
    });
  } catch (error) {
    // Silent failure: log error but do not block the redirection flow
    console.error("Referral click tracking failed silently:", error.response?.data || error.message);
  }
};
