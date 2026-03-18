import apiClient from "./client";

/**
 * Auth API Methods
 * - POST /auth/signup       → signup
 * - POST /auth/login        → login
 * - POST /auth/logout       → logout
 * - POST /auth/refresh      → refreshToken
 * - GET  /auth/me           → getCurrentUser
 */
export const authApi = {
  signup: (email, password, name) =>
    apiClient.post("/auth/signup", { email, password, name }).then((r) => r.data),

  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }).then((r) => r.data),

  logout: () => apiClient.post("/auth/logout").then((r) => r.data),

  refreshToken: (refreshToken) =>
    apiClient.post("/auth/refresh", { refreshToken }).then((r) => r.data),

  getCurrentUser: () => apiClient.get("/auth/me").then((r) => r.data),
};
