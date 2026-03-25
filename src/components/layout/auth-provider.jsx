"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

/**
 * Auth Context Provider
 *
 * Provides:
 * - Current user state
 * - Login/logout methods
 * - Auth token management
 * - Google OAuth context
 *
 * Uses: Zustand (useAuthStore), React Context (provider pattern)
 * TODO: On mount, call authApi.getCurrentUser() to hydrate user state
 */

export function AuthProvider({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  if (!googleClientId) {
    console.warn(
      "Google OAuth not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local"
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || "placeholder"}>
      {children}
    </GoogleOAuthProvider>
  );
}
