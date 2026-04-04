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
   * GET /referee/<event_id>/stats/ — Individual program metrics and ticket history.
   * This is the primary source of stats for the referee.
   */
  getEventStats: (eventId) => 
    apiClient.get(`/referee/${eventId}/stats/`).then((res) => res.data),

  // ==========================================
  // FEEDBACK & ERROR HANDLING
  // ==========================================

  /**
   * Note: Global summary endpoints (/referrals/stats/) are not currently
   * available on the backend. Use getEventStats per event id for now.
   */
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
