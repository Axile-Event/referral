import { create } from "zustand";
import { authApi } from "@/lib/api/auth";
import { transformSignupData } from "@/lib/utils/authTransform";

/**
 * Auth Store (Zustand)
 * Aligned with referee auth flow in API_DOCUMENTATION.MD
 * State: user, isAuthenticated, isLoading, error
 * Actions: login, googleLogin, signup, verifyOtp, logout, fetchProfile
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: (typeof window !== "undefined" && !!localStorage.getItem("axile_token")),
  isLoading: false,
  error: null,

  /**
   * Login with email and password
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.login(email, password);
      // Backend returns { access, refresh }
      if (typeof window !== "undefined") {
        localStorage.setItem("axile_token", res.access);
        localStorage.setItem("axile_refresh", res.refresh);
      }
      
      // Fetch full profile info
      const profile = await authApi.getProfile();
      set({ user: profile, isAuthenticated: true });
      return profile;
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.response?.data?.detail || err.message;
      set({ error: msg });
      throw err; // Throw so component catch block triggers
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Google OAuth login
   */
  googleSignup: async (idToken) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.googleSignup(idToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("axile_token", res.access);
        localStorage.setItem("axile_refresh", res.refresh);
      }
      const profile = await authApi.getProfile();
      set({ user: profile, isAuthenticated: true });
      return profile;
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Signup with field transformation for correct API casing
   */
  signup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // Use transformSignupData to ensure correct casing (Username, Firstname, etc.)
      const payload = transformSignupData(data);
      const res = await authApi.signup(payload);
      return res;
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Verify OTP sent to email
   */
  verifyOtp: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.verifyOtp(email, otp);
      if (res.access && typeof window !== "undefined") {
        localStorage.setItem("axile_token", res.access);
        localStorage.setItem("axile_refresh", res.refresh);
        const profile = await authApi.getProfile();
        set({ user: profile, isAuthenticated: true });
      }
      return res;
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Resend OTP code to the provided email
   */
  resendOtp: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.resendOtp(email);
      return res;
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Fetch current user profile
   */
  fetchProfile: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("axile_token") : null;
    if (!token) return;
    
    try {
      const profile = await authApi.getProfile();
      set({ user: profile, isAuthenticated: true });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      if (err.response?.status === 401) {
        get().logout();
      }
    }
  },

  /**
   * Logout and clear local state
   */
  logout: async () => {
    const refresh = typeof window !== "undefined" ? localStorage.getItem("axile_refresh") : null;
    if (refresh) {
      try { await authApi.logout(refresh); } catch {}
    }
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("axile_token");
      localStorage.removeItem("axile_refresh");
    }
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearError: () => set({ error: null }),
}));
