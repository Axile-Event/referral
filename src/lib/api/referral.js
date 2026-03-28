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

  // GET /referrals/ — List of user's active tracking links/campaigns
  getUserReferrals: () => apiClient.get("/referrals/").then((r) => r.data),

  // GET /referrals/stats/ — Overall referral earnings & metrics
  getStats: () => apiClient.get("/referrals/stats/").then((r) => r.data),

  // POST /referrals/<id>/disable/ — Deactivate a link
  disableLink: (id) => apiClient.post(`/referrals/${id}/disable/`).then((r) => r.data),

  // POST /referrals/track/ — Logs a link click
  trackClick: (code, eventId) =>
    apiClient.post("/referrals/track/", { code, eventId }).then((r) => r.data),

  // POST /referrals/generate/ — Create a new tracking link
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
