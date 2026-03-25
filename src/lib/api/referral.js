import apiClient from "./client";

/**
 * Referral API Service
 * Handles all backend HTTP communication for the referral system.
 * Documentation strictly matches active rendering API requirements.
 */
export const referralApi = {

  // ==========================================
  // REFEREE MARKETPLACE (Events)
  // ==========================================

  /**
   * Fetches all events that allow referrals (`use_referral: true`)
   * Request requires active JWT token (handled by apiClient).
   * @returns {Promise<{ events: Array, count: number }>}
   */
  getReferrableEvents: () => 
    apiClient.get("/referee/events/").then((res) => res.data),
  
  /**
   * Fetches detailed data for a specific referrable event.
   * Required for the detail page (includes ticket limits & categories).
   * @param {string} identifier - Event ID or Slug
   * @returns {Promise<Object>} The specific event data blob
   */
  getReferrableEventDetail: (identifier) => 
    apiClient.get(`/referee/events/${identifier}/`).then((res) => res.data),


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
   * @param {string} eventId - Target Event
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
