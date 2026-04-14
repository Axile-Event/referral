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
 * Securely hashes a PIN using SHA-256
 */
const hashPin = async (pin) => {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    // Fallback or handle non-browser environment
    return null;
  }
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(String(pin));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    console.error("Hashing failed:", err);
    return null;
  }
};

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
      pinHash: null,    // Correctly set to null initially
      isPinSetRemotely: false,
 
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

          set({ authMethod: "email" });
          get().setAuth(user, finalToken, refresh, role);
          return response;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Verify OTP Action (Async)
       * Called during signup flow after user receives OTP via email
       */
      verifyOtp: async (email, otp) => {
        set({ isLoading: true });
        try {
          const response = await authApi.verifyOtp({ email, otp });
          // After verification, user gets tokens and is logged in
          if (response?.access || response?.token) {
            const { user, access, refresh, role, token } = response;
            const finalToken = access || token;
            get().setAuth(user, finalToken, refresh, role);
          }
          return response;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Resend OTP Action (Async)
       * For users who didn't receive their verification code
       */
      resendOtp: async (email) => {
        set({ isLoading: true });
        try {
          const response = await authApi.resendOtp(email);
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
          
          // Map backend response fields accurately (handling both flat and nested structures)
          const { access, refresh, token, refresh_token, referral_user, email } = response;
          const finalToken = access || token || response.access_token || referral_user?.access || referral_user?.token;
          const finalRefresh = refresh || refresh_token || response.refresh_token || referral_user?.refresh || referral_user?.refresh_token;
          const finalUser = referral_user || { email: email || response.email };

          if (finalToken) {
            set({ authMethod: "google" });
            get().setAuth(finalUser, finalToken, finalRefresh, response.role || "user");
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

          const currentEmail = userData?.email || userData?.Email;
          const userPinHash = currentEmail ? localStorage.getItem(`Axile_pin_hash_${currentEmail}`) : null;

          const authData = {
            state: {
              user: userData,
              token,
              refreshToken: refresh,
              role,
              isAuthenticated: true,
              hydrated: true,
              authMethod: get().authMethod,
              pinHash: userPinHash,
            },
            version: 0,
          };
          
          if (userPinHash) {
             set({ pinHash: userPinHash });
          }
          
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
          // 1. Remove from parent domain (.axile.ng)
          const domain = getCookieDomain();
          if (domain) {
            Cookies.remove("axile_shared_auth", { domain });
          }
          // 2. Remove from current subdomain (just in case)
          Cookies.remove("axile_shared_auth", { path: '/' });
          
          localStorage.removeItem("auth-storage");
          // Axile_pin_hash is NOT removed to ensure frontend remains aware of PIN status across sessions
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
          pinHash: null, // Clear in-memory state but keep user-specific localStorage
          isPinSetRemotely: false,
        });
      },

      setHydrated: () => set({ hydrated: true }),
      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          // 1. Try referee-specific profile
          try {
            const profile = await authApi.getProfile();
            if (profile) {
              const userData = profile?.user || profile?.profile || profile;
              get().setUser(userData);
              
              // If backend says PIN is set, but local hash is missing, mark it set remotely
              if (userData.has_pin || userData.pin_set) {
                set({ isPinSetRemotely: true });
              }
              return profile;
            }
          } catch (err) {
            // If it's a 404, we'll try the root profile fallback
            if (err.response?.status === 404) {
              console.warn("AuthStore: Referee profile not found, trying root profile fallback...");
            } else {
              throw err;
            }
          }

          // 2. Fallback: try root profile endpoint (usually /profile/)
          // Some users might exist in the main User table but not yet in the Referee profile table
          const rootProfile = await authApi.getProfileFallback();
          if (rootProfile) {
            const userData = rootProfile?.user || rootProfile?.profile || rootProfile;
            get().setUser(userData);
            return rootProfile;
          }
        } catch (error) {
          console.error("AuthStore: Profile fetch failed completely", error);
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
       * Stores hashed version locally for secure local verification
       */
      setPin: async (pin) => {
        set({ isLoading: true });
        try {
          const response = await authApi.createPin(pin);
          
          // Securely hash and store the PIN on the client
          const hashedPin = await hashPin(pin);
          if (hashedPin) {
            set({ pinHash: hashedPin, isPinSetRemotely: true });
            if (typeof window !== "undefined" && get().user?.email) {
               localStorage.setItem(`Axile_pin_hash_${get().user.email}`, hashedPin);
            }
          }

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
       * Verify a PIN against the securely stored local hash
       */
      verifyStoredPin: async (inputPin) => {
        const { pinHash } = get();
        if (!pinHash) {
          // Fallback to localStorage if state is lost
          const localHash = typeof window !== "undefined" ? localStorage.getItem("Axile_pin_hash") : null;
          if (!localHash) return false;
          set({ pinHash: localHash });
        }
        
        const inputHash = await hashPin(inputPin);
        return inputHash === (pinHash || get().pinHash);
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

      /**
       * Forgot Password - Send recovery code to email
       */
      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          const response = await authApi.forgotPassword(email);
          return response;
        } catch (error) {
          console.error("AuthStore: Forgot password failed", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Verify Reset OTP & get token
       */
      verifyResetOtp: async (email, otp) => {
        set({ isLoading: true });
        try {
          const response = await authApi.verifyResetOtp({ email, otp });
          return response;
        } catch (error) {
          console.error("AuthStore: Verify reset OTP failed", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Reset Password with new password
       */
      resetPassword: async (email, otp, newPassword, uid, token) => {
        set({ isLoading: true });
        try {
          const payload = {
            email,
            otp,
            new_password: newPassword,
            confirm_password: newPassword
          };
          // Add uid/token if provided
          if (uid) payload.uid = uid;
          if (token) payload.token = token;
          
          const response = await authApi.resetPassword(payload);
          return response;
        } catch (error) {
          console.error("AuthStore: Reset password failed", error);
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

