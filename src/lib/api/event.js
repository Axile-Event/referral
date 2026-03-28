import apiClient from "./client";

/**
 * Event API Methods
 * - GET /events                         → getEvents
 * - GET /events?referralEnabled=true    → getReferralEnabledEvents
 * - GET /events/:id                     → getEventById
 * - GET /events/:id/referral-info       → getEventReferralInfo
 */
export const eventApi = {
  getEvents: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get(`/events/${params ? `?${params}` : ""}`).then((r) => r.data);
  },

  getReferralEnabledEvents: () =>
    apiClient.get("/events/?referralEnabled=true").then((r) => r.data),

  getEventById: (id) => apiClient.get(`/events/${id}/`).then((r) => r.data),

  getEventReferralInfo: (id) =>
    apiClient.get(`/events/${id}/referral-info/`).then((r) => r.data),
};
