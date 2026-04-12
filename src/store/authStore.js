import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { authApi } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/utils/tokenStorage";

// Import token refresh timer functions (dynamic import to avoid circular dependency)
let startTokenRefreshTimer, stopTokenRefreshTimer;
if (typeof window !== "undefined") {
  import("../lib/axios").then((module) => {
    startTokenRefreshTimer = module.startTokenRefreshTimer;
    stopTokenRefreshTimer = module.stopTokenRefreshTimer;
  });
}

/**
 * Get the correct cookie domain for cross-subdomain sharing.
 * Production (.axile.ng): returns ".axile.ng"
 * Dev/Vercel/localhost: returns undefined (current domain only)
 */
function getCookieDomain() {
  if (typeof window === "undefined") return undefined;
  const hostname = window.location.hostname;
  if (hostname.endsWith(".axile.ng") || hostname === "axile.ng") {
    return ".axile.ng";
  }
  return undefined;
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
      authMethod: null, // "email" or "google"
 
       /**
        * Primary Signup Action (Async)
        */
      signup: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.signup(data);
          return response;
        } finally {
          set({ isLoading: false });
        }
      },

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
          set({ authMethod: "email" });
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
          console.log("AuthStore: Initiating googleSignup with accessToken");
          const response = await authApi.googleSignup({ 
            access_token: accessToken,
            token: accessToken 
          });

          console.log("AuthStore: googleSignup response reached store", response);
          
          // Map backend response fields accurately
          const { access, refresh, token, refresh_token, referral_user, email } = response;
          const finalToken = access || token || response.access_token;
          const finalRefresh = refresh || refresh_token || response.refresh_token;
          const finalUser = referral_user || { email: email || response.email };

          if (finalToken) {
            get().setAuth(finalUser, finalToken, finalRefresh, response.role || "user");
            set({ authMethod: "google" });
          } else {
             console.warn("AuthStore: googleSignup succeeded but no token returned", response);
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
          const cookieOptions = { 
            expires: 7,
            secure: window.location.protocol === "https:",
            sameSite: 'Lax'
          };
          const domain = getCookieDomain();
          if (domain) cookieOptions.domain = domain;

          Cookies.set("axile_shared_auth", JSON.stringify(cookieData), cookieOptions);

          // Sync with the standalone tokenStorage used by apiClient
          tokenStorage.setTokens(token, refresh);

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
        console.log("AuthStore: Logout triggered");
        if (typeof window !== "undefined") {
          const removeOpts = {};
          const domain = getCookieDomain();
          if (domain) removeOpts.domain = domain;
          Cookies.remove("axile_shared_auth", removeOpts);
          localStorage.removeItem("auth-storage");
          tokenStorage.clearTokens();
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
          authMethod: null,
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
        set({ isLoading: true });
        try {
          const profile = await authApi.getProfile();
          if (profile) {
            const userData = profile?.user || profile?.profile || profile;
            get().setUser(userData);
            return profile;
          }
        } catch (error) {
          console.error("AuthStore: Profile fetch failed", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Update Profile (Async)
       */
      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.updateProfile(data);
          const userData = response?.user || response?.profile || response;
          get().setUser(userData);
          return response;
        } catch (error) {
          console.error("AuthStore: Update profile failed", error.response?.data || error.message);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Set PIN (Async)
       */
      setPin: async (pin) => {
        set({ isLoading: true });
        try {
          const response = await authApi.createPin(pin);
          if (get().user) {
            get().setUser({ has_pin: true, pin_set: true });
          }
          return response;
        } catch (error) {
          console.error("AuthStore: Set PIN failed", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Change Password (Async)
       */
      changePassword: async (oldPassword, newPassword) => {
        set({ isLoading: true });
        try {
          const response = await authApi.changePassword(oldPassword, newPassword);
          return response;
        } catch (error) {
          console.error("AuthStore: Change password failed", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Sync state from shared cookie if localStorage is empty
      syncWithCookie: () => {
        if (typeof window === "undefined") return;
        
        // 1. Cross-Domain Session Bridge: Check URL for sync data
        const searchParams = new URLSearchParams(window.location.search);
        const urlSyncData = searchParams.get("ax_sync");
        
        if (urlSyncData) {
          try {
            const decoded = decodeURIComponent(urlSyncData);
            const parsed = JSON.parse(decoded);
            const { token, refreshToken, role } = parsed;
            
            if (token) {
              set({ 
                token, 
                refreshToken: refreshToken || null, 
                role: role || null, 
                isAuthenticated: true 
              });

              tokenStorage.setTokens(token, refreshToken);

              // Set a LOCAL cookie so it persists on this domain too
              const cookieOpts = { 
                expires: 7, 
                path: "/",
                sameSite: 'Lax',
                secure: window.location.protocol === 'https:'
              };
              const domain = getCookieDomain();
              if (domain) cookieOpts.domain = domain;
              
              Cookies.set("axile_shared_auth", decoded, cookieOpts);

              // Clean up the URL
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.delete("ax_sync");
              window.history.replaceState({}, '', newUrl.toString());
              
              if (startTokenRefreshTimer) startTokenRefreshTimer();
              return true;
            }
          } catch (e) {
            console.error("Session bridge sync failed in Referral app", e);
          }
        }

        // 2. Standard Cookie Sync (Works on .axile.ng subdomains)
        if (get().token) return; // Don't overwrite if already have a local token
        
        const shared = Cookies.get("axile_shared_auth");
        if (shared) {
          try {
            const decoded = shared.startsWith("%") ? decodeURIComponent(shared) : shared;
            const parsed = JSON.parse(decoded);
            const { token, refreshToken, role } = parsed;
            if (token) {
              set({ token, refreshToken, role, isAuthenticated: true });
              tokenStorage.setTokens(token, refreshToken);
              if (startTokenRefreshTimer) startTokenRefreshTimer();
              return true;
            }
          } catch (e) {
            console.error("Failed to sync shared auth in Referral app", e);
          }
        }
        return false;
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

