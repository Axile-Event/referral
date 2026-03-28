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

  // These might still be used for generic interactions or need backend check
  trackClick: (code, eventId) =>
    apiClient.post("/referrals/track/", { code, eventId }).then((r) => r.data),

  generateLink: (eventId) =>
    apiClient.post("/referrals/generate/", { eventId }).then((r) => r.data),
};
