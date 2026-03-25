import apiClient from "./client";
import { tokenStorage } from "@/lib/utils/tokenStorage";

/**
 * Auth API Methods
 * Handles all authentication-related API calls
 * 
 * Endpoints:
 * - POST /signup/      → User registration
 * - POST /verify-otp/  → Email verification
 * - POST /login/       → User authentication
 * - POST /token/refresh/ → Token refresh
 * - GET  /auth/me/    → Current user profile
 * - POST /logout/     → Sign out
 */

export const authApi = {
  /**
   * Register new referee account
   */
  signup: (userData) =>
    apiClient.post("/signup/", userData).then((r) => r.data),

  /**
   * Verify email with OTP
   */
  verifyOtp: (email, otp) =>
    apiClient.post("/verify-otp/", { email, otp }).then((r) => r.data),

  /**
   * Authenticate user with email and password
   */
  login: (email, password) =>
    apiClient.post("/login/", { email, password }).then((r) => r.data),

  /**
   * Refresh expired access token
   */
  refreshToken: (refresh) =>
    apiClient.post("/token/refresh/", { refresh }).then((r) => r.data),

  /**
   * Get current authenticated user profile
   */
  getCurrentUser: () => apiClient.get("/auth/me/").then((r) => r.data),

  /**
   * Logout user and invalidate refresh token
   */
  logout: () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      return apiClient
        .post("/logout/", { refresh: refreshToken })
        .then((r) => r.data)
        .catch(() => ({ success: true })); // Logout succeeds even if request fails
    }
    return Promise.resolve({ success: true });
  },
};
