import { authApi } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/utils/tokenStorage";
import { transformSignupData, transformOtpData } from "@/lib/utils/authTransform";
import { getErrorMessage } from "@/lib/utils/authError";
import { create } from "zustand";
import { authApi } from "@/lib/api/auth";

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
};

/**
 * Common async action wrapper for consistent error/loading handling
 */
const createAsyncAction = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (err) {
    throw err;
  }
};

export const useAuthStore = create((set) => ({
  ...initialState,

  /**
   * Login with email and password
   */
  login: createAsyncAction(async (email, password) => {
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
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      return { success: false, error: msg };
    } finally {
      set({ isLoading: false });
    }
  },

  googleLogin: async (idToken) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.googleSignup(idToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("axile_token", res.access);
        localStorage.setItem("axile_refresh", res.refresh);
      }
      const profile = await authApi.getProfile();
      set({ user: profile, isAuthenticated: true });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.signup(data);
      // Doc: 201 returns user object or success
      return { success: true, data: res };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    } finally {
      set({ isLoading: false });
    }
  }),

  verifyOtp: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.verifyOtp(email, otp);
      // This returns tokens usually or redirects to login
      if (res.access && typeof window !== "undefined") {
        localStorage.setItem("axile_token", res.access);
        localStorage.setItem("axile_refresh", res.refresh);
        const profile = await authApi.getProfile();
        set({ user: profile, isAuthenticated: true });
      }
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    } finally {
      set({ isLoading: false });
    }
  }),

  /**
   * Verify OTP sent to email
   */
  verifyOtp: createAsyncAction(async (email, otp) => {
    set({ isLoading: true, error: null });
    let transformedData = null;
    try {
      transformedData = transformOtpData(email, otp);
      console.log("--- OTP Verification Debug ---");
      console.log("Sending Payload:", transformedData);
      
      const res = await authApi.verifyOtp(transformedData);
      console.log("OTP Verification Success:", res);
      
      return res;
    } catch (err) {
      console.error("--- OTP Verification Failure ---");
      console.error("Status:", err?.response?.status);
      console.error("Data:", err?.response?.data);
      console.error("Message:", err?.message);
      console.error("Payload that was sent:", transformedData);
      
      const message = getErrorMessage(err, "Verification failed");
      set({ error: message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }),

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

  /**
   * Update user state (e.g., after profile fetch)
   */
  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  /**
   * Clear error message
   */
  clearError: () => set({ error: null }),

  /**
   * Check if user is authenticated
   */
  isAuth: () => tokenStorage.hasTokens(),

  /**
   * Fetch latest user profile from API
   */
  fetchProfile: createAsyncAction(async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await authApi.getProfile();
      set({ user: profile, isAuthenticated: true });
      return profile;
    } catch (err) {
      const message = getErrorMessage(err, "Failed to fetch profile");
      set({ error: message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }),

  /**
   * Update user profile
   */
  updateProfile: createAsyncAction(async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await authApi.updateProfile(userData);
      set({ user: updated });
      return updated;
    } catch (err) {
      const message = getErrorMessage(err, "Failed to update profile");
      set({ error: message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }),

  /**
   * Sign up with Google OAuth token
   */
  googleSignup: createAsyncAction(async (googleToken) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.googleSignup(googleToken);
      if (res.access && res.refresh) {
        tokenStorage.setTokens(res.access, res.refresh);
        set({ user: res.user, isAuthenticated: true });
      }
      return res;
    } catch (err) {
      const message = getErrorMessage(err, "Google signup failed");
      set({ error: message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }),
}));
