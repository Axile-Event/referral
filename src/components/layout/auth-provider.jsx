"use client";

/**
 * Auth Context Provider
 *
 * Provides:
 * - Current user state
 * - Login/logout methods
 * - Auth token management
 *
 * Uses: Zustand (useAuthStore), React Context (provider pattern)
 * TODO: On mount, call authApi.getCurrentUser() to hydrate user state
 */

export function AuthProvider({ children }) {
  // TODO: Implement auth provider wrapper
  // - Hydrate user from token on mount
  // - Redirect to /login if unauthenticated on protected routes
  return children;
}
