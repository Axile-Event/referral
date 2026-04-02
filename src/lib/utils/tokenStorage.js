/**
 * Token Storage Utility
 * Centralized token management for authentication
 */

const TOKEN_KEYS = {
  ACCESS: "axile_token",
  REFRESH: "axile_refresh",
};

export const tokenStorage = {
  /**
   * Get access token from localStorage
   */
  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEYS.ACCESS);
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEYS.REFRESH);
  },

  /**
   * Save tokens to localStorage
   */
  setTokens: (accessToken, refreshToken) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
  },

  /**
   * Clear all tokens from localStorage
   */
  clearTokens: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
  },

  /**
   * Check if tokens exist
   */
  hasTokens: () => {
    if (typeof window === "undefined") return false;
    return !!(
      localStorage.getItem(TOKEN_KEYS.ACCESS) &&
      localStorage.getItem(TOKEN_KEYS.REFRESH)
    );
  },
};
