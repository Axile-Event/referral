import apiClient from "./client";

/**
 * Referral API Methods
 * - GET  /referrals          → getUserReferrals
 * - POST /referrals/generate → generateLink
 * - POST /referrals/track    → trackClick
 * - GET  /referrals/stats    → getStats
 */
export const referralApi = {
  getUserReferrals: () => apiClient.get("/referrals").then((r) => r.data),

  getReferrableEvents: () => apiClient.get("/referee/events").then((r) => r.data),

  generateLink: (eventId) =>
    apiClient.post("/referrals/generate", { eventId }).then((r) => r.data),

  trackClick: (code, eventId) =>
    apiClient.post("/referrals/track", { code, eventId }).then((r) => r.data),

  getStats: () => apiClient.get("/referrals/stats").then((r) => r.data),

  disableLink: (referralId) =>
    apiClient.post(`/referrals/${referralId}/disable`).then((r) => r.data),
};
