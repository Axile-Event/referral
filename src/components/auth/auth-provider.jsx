"use client";

import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthStore } from "@/store/authStore";

/**
 * AuthProvider
 * Wraps the app with necessary authentication contexts.
 * Currently includes Google OAuth and state hydration.
 */
export function AuthProvider({ children }) {
  const { token, fetchProfile } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const init = async () => {
      try {
        if (token) {
          await fetchProfile();
        }
      } catch (error) {
        console.error("Initial profile fetch failed:", error);
      } finally {
        setHydrated(true);
      }
    };
    init();
  }, [fetchProfile, token]);

  if (!hydrated) {
    return <div className="min-h-screen bg-[#0a0a14]" />;
  }

  if (!clientId) {
    console.warn("Google Client ID is missing. Google Login will not work.");
    return children;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
