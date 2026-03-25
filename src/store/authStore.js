import { authApi } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/utils/tokenStorage";
import { transformSignupData, transformOtpData } from "@/lib/utils/authTransform";
import { getErrorMessage } from "@/lib/utils/authError";
import { create } from "zustand";

/**
 * Auth Store (Zustand)
 * 
 * Manages:
 * - User authentication state
 * - Token storage and retrieval
 * - Loading and error states
 * - Auth actions (login, signup, logout)
 */

const initialState = {
  user: null,
  isAuthenticated: false,
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
      tokenStorage.setTokens(res.access, res.refresh);
      set({ user: res.user, isAuthenticated: true });
      return res;
    } catch (err) {
      const message = getErrorMessage(err, "Login failed");
      set({ error: message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  }),

  /**
   * Register new user account
   */
  signup: createAsyncAction(async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const transformedData = transformSignupData(userData);
      const res = await authApi.signup(transformedData);
      return res;
    } catch (err) {
      const message = getErrorMessage(err, "Signup failed");
      set({ error: message });
      throw err;
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

  /**
   * Logout user and clear tokens
   */
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      tokenStorage.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
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
