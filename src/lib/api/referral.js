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
  getEventDetail: (identifier) => 
    apiClient.get(`/referee/events/${identifier}/`).then((res) => res.data),

  /**
   * GET /referee/<event_id>/stats/ — Self stats for referee
   */
  getEventStats: (eventId) => 
    apiClient.get(`/referee/${eventId}/stats/`).then((res) => res.data),

  // ==========================================
  // PERSONAL REFERRALS & ACTIONS
  // ==========================================

  /**
   * Fetches the set of active referral campaigns managed by the current user.
   */
  getUserReferrals: () => 
    apiClient.get("/referrals/").then((res) => res.data),

  /**
   * Request the system to generate a unique tracking link for a selected event.
   */
  generateLink: (eventId) =>
    apiClient.post("/referrals/generate/", { eventId }).then((res) => res.data),

  /**
   * Logs an anonymous click on the user's referral code to track link traffic.
   */
  trackClick: (code, eventId) =>
    apiClient.post("/referrals/track/", { code, eventId }).then((res) => res.data),

  /**
   * Retrieves high-level analytics (earnings, conversions) for the user's wallet.
   */
  getStats: () => 
    apiClient.get("/referrals/stats/").then((res) => res.data),

  /**
   * Allows the referee to deactivate their referral tracking link intentionally.
   */
  disableLink: (referralId) =>
    apiClient.post(`/referrals/${referralId}/disable/`).then((res) => res.data),
};
