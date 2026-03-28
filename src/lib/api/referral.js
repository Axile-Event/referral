import apiClient from "./client";

/**
 * Referral API Methods (Referee)
 * Aligned with API_DOCUMENTATION.MD
 */
export const referralApi = {
  // GET /referee/events/ — List events with use_referral=true
  getReferrableEvents: () => apiClient.get("/referee/events/").then((r) => r.data),

  // GET /referee/events/<id>/ — Details for referee
  getEventDetail: (id) => apiClient.get(`/referee/events/${id}/`).then((r) => r.data),

  // GET /referee/<event_id>/stats/ — Self stats for referee
  getEventStats: (eventId) => apiClient.get(`/referee/${eventId}/stats/`).then((r) => r.data),

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
    apiClient.post("/referrals/generate/", { eventId }).then((r) => r.data),
};
