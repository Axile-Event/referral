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

  // ==========================================
  // REFEREE DASHBOARD (New Endpoints)
  // ==========================================

  /**
   * GET /referee/stats/ — Global summary statistics
   * Expected: { total_clicks, total_conversions, pending_conversions, checked_in_referrals }
   */
  getRefereeStats: () =>
    apiClient.get("/referee/stats/").then((res) => res.data),

  /**
   * GET /referee/activity/ — Detailed activity history
   * Expected: Array of { event_name, buyer_id, status, date }
   */
  getRefereeActivity: () =>
    apiClient.get("/referee/activity/").then((res) => res.data),
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
