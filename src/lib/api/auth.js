import apiClient from "./client";
import { tokenStorage } from "@/lib/utils/tokenStorage";

/**
 * Auth API Module
 * Implements all authentication endpoints from Axile API
 * 
 * API Endpoints:
 * - POST /signup/              → User registration
 * - POST /verify-otp/          → Email OTP verification
 * - POST /login/               → User authentication
 * - POST /logout/              → Sign out
 * - POST /token/refresh/       → Refresh access token
 * - GET  /referee/profile/     → Get current user profile
 * - PATCH /referee/profile/    → Update user profile
 * - POST /referee/google-signup/ → Sign up with Google
 */

export const authApi = {
  /**
   * Register new referee account
   * @param {Object} userData - { username, firstname, lastname, email, password, phone }
   */
  signup: (userData) =>
    apiClient.post("/signup/", userData).then((r) => r.data),

  /**
   * Verify email with OTP code
   * @param {Object} data - { email, otp }
   */
  verifyOtp: (data) =>
    apiClient.post("/verify-otp/", data).then((r) => r.data),

  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} { access, refresh, user }
   */
  login: (email, password) =>
    apiClient.post("/login/", { email, password }).then((r) => r.data),

  /**
   * Refresh expired access token
   * @param {string} refreshToken - Refresh token from login
   */
  refreshToken: (refreshToken) =>
    apiClient.post("/token/refresh/", { refresh: refreshToken }).then((r) => r.data),

  /**
   * Get current authenticated user's profile
   */
  getProfile: () =>
    apiClient.get("/referee/profile/").then((r) => r.data),

  /**
   * Update current user's profile
   * @param {Object} userData - Profile fields to update
   */
  updateProfile: (userData) =>
    apiClient.patch("/referee/profile/", userData).then((r) => r.data),

  /**
   * Sign up with Google OAuth token
   * @param {string} token - Google access token from OAuth flow
   */
  googleSignup: (token) =>
    apiClient.post("/referee/google-signup/", { token }).then((r) => r.data),

  /**
   * Logout user and invalidate refresh token
   */
  logout: () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      return apiClient
        .post("/logout/", { refresh: refreshToken })
        .then((r) => r.data)
        .catch(() => ({ success: true })); // Graceful fallback if backend fails
    }
    return Promise.resolve({ success: true });
  },

  /**
   * TODO: Password reset endpoints (not yet documented in API)
   * Expected endpoints:
   * - POST /forgot-password/ → Request password reset email
   * - POST /reset-password/ → Reset password with token
   */
};
