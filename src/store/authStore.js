import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { authApi } from "@/lib/api/auth";

// Import token refresh timer functions (dynamic import to avoid circular dependency)
let startTokenRefreshTimer, stopTokenRefreshTimer;
if (typeof window !== "undefined") {
  import("../lib/axios").then((module) => {
    startTokenRefreshTimer = module.startTokenRefreshTimer;
    stopTokenRefreshTimer = module.stopTokenRefreshTimer;
  });
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      token: null,
      refreshToken: null,
      hydrated: false,
      isAuthenticated: false,
      isLoading: false,

      /**
       * Primary Login Action (Async)
       */
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // Some backends expect 'username', others 'email'
          // We try to be flexible by sending both as the identifier
          const response = await authApi.login({ 
            email, 
            username: email, 
            password 
          });

          const { user, access, refresh, role, token } = response;
          const finalToken = access || token;

          get().setAuth(user, finalToken, refresh, role);
          return response;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Google Authentication Action (Async)
       */
      googleSignup: async (accessToken) => {
        set({ isLoading: true });
        try {
          const response = await authApi.googleSignup({ 
            access_token: accessToken,
            token: accessToken 
          });

          const { user, access, refresh, role, token } = response;
          const finalToken = access || token;

          if (finalToken) {
            get().setAuth(user, finalToken, refresh, role);
          }
          return response;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Internal state setter for auth data
       */
      setAuth: (userData, token, refresh, role) => {
        // Shared cookie for cross-subdomain auth
        if (typeof window !== "undefined") {
          const cookieData = { token, refreshToken: refresh, role };
          Cookies.set("axile_shared_auth", JSON.stringify(cookieData), { 
            domain: ".axile.ng", 
            expires: 7,
            secure: true,
            sameSite: 'Lax'
          });

          localStorage.removeItem("organizer-storage");
          localStorage.removeItem("Axile_pin_reminder_dismissed");

          const authData = {
            state: {
              user: userData,
              token,
              refreshToken: refresh,
              role,
              isAuthenticated: true,
              hydrated: true,
            },
            version: 0,
          };
          localStorage.setItem("auth-storage", JSON.stringify(authData));
        }

        set({
          user: userData,
          token,
          refreshToken: refresh,
          role,
          isAuthenticated: true,
        });

        if (startTokenRefreshTimer) {
          startTokenRefreshTimer();
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          Cookies.remove("axile_shared_auth", { domain: ".axile.ng" });
          localStorage.removeItem("auth-storage");
        }

        if (stopTokenRefreshTimer) {
          stopTokenRefreshTimer();
        }

        set({
          user: null,
          role: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setHydrated: () => set({ hydrated: true }),
      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      /**
       * Fetch Profile (Async)
       * Tries namespaced referee profile, falls back to root if 404s.
       */
      fetchProfile: async () => {
        try {
          const profile = await authApi.getProfile();
          if (profile) {
            get().setUser(profile?.user || profile?.profile || profile);
            return profile;
          }
        } catch (error) {
          // Fallback if referee namespace is not yet deployed or mismatch
          if (error.response?.status === 404) {
            try {
              const response = await authApi.getProfileFallback();
              if (response) {
                const pData = response.data || response;
                get().setUser(pData?.user || pData?.profile || pData);
                return pData;
              }
            } catch (fallbackError) {
              console.error("AuthStore: Profile fallback also failed", fallbackError);
            }
          }
          console.error("AuthStore: Profile fetch failed", error);
          throw error;
        }
      },
      
      // Sync state from shared cookie if localStorage is empty
      syncWithCookie: () => {
        if (typeof window === "undefined" || get().token) return;
        
        const shared = Cookies.get("axile_shared_auth");
        if (shared) {
          try {
            const { token, refreshToken, role } = JSON.parse(shared);
            if (token) {
              set({ token, refreshToken, role, isAuthenticated: true });
              if (startTokenRefreshTimer) startTokenRefreshTimer();
            }
          } catch (e) {
            console.error("Failed to sync shared auth", e);
          }
        }
      }
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state.setHydrated();
        // Check for shared cookie on hydration
        state.syncWithCookie();
      },
    }
  )
);

export default useAuthStore;

