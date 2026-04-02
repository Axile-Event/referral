import { create } from "zustand";
import { authApi } from "@/lib/api/auth";
import { transformSignupData, transformOtpData, transformLoginData, normalizeUserProfile, transformResetPasswordData } from "@/lib/utils/authTransform";
import { tokenStorage } from "@/lib/utils/tokenStorage";

/**
 * Auth Store (Zustand)
 * Aligned with referee auth flow in API_DOCUMENTATION.MD
 * State: user, isAuthenticated, isLoading, error
 * Actions: login, googleLogin, signup, verifyOtp, logout, fetchProfile
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: (typeof window !== "undefined" && !!tokenStorage.getAccessToken()),
  isLoading: false,
  error: null,

  /**
   * Login with email and password
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const payload = transformLoginData(email, password);
      console.log("Attempting Login with payload:", payload);
      
      const res = await authApi.login(payload);
      // Backend returns { access, refresh }
      if (res.access) {
        tokenStorage.setTokens(res.access, res.refresh);
      }
      
      // Fetch full profile info and normalize it
      const profile = await authApi.getProfile();
      const normalizedProfile = normalizeUserProfile(profile);
      set({ user: normalizedProfile, isAuthenticated: true });
      return normalizedProfile;
    } catch (err) {
      console.error("Login Backend Error Response:", err.response?.data);
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
  googleSignup: async (token) => {
    set({ isLoading: true, error: null });
    try {
      // Backend may expect "token" or "access_token" or capitalized "Token"
      // We send both common variants for robustness
      const res = await authApi.googleSignup({ 
        token: token,
        access_token: token,
        Token: token 
      });
      
      if (res.access) {
        tokenStorage.setTokens(res.access, res.refresh);
      }
      const profile = await authApi.getProfile();
      const normalizedProfile = normalizeUserProfile(profile);
      set({ user: normalizedProfile, isAuthenticated: true });
      return normalizedProfile;
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
      const payload = transformOtpData(email, otp);
      console.log("Verifying OTP with payload:", payload);
      
      const res = await authApi.verifyOtp(payload);
      if (res.access) {
        tokenStorage.setTokens(res.access, res.refresh);
        const profile = await authApi.getProfile();
        const normalizedProfile = normalizeUserProfile(profile);
        set({ user: normalizedProfile, isAuthenticated: true });
      }
      return res;
    } catch (err) {
      // LOG THE BACKEND ERROR BODY SO WE CAN SEE MISSING FIELDS
      console.error("OTP Verification Backend Response:", err.response?.data);
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
   * Request password reset OTP
   */
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.forgotPassword(email);
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
   * Verify password reset OTP
   */
  verifyResetOtp: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const payload = transformOtpData(email, otp);
      const res = await authApi.verifyResetOtp(payload);
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
   * Reset password using OTP and new password
   */
  resetPassword: async (email, otp, newPassword, uid = "", token = "") => {
    set({ isLoading: true, error: null });
    try {
      const payload = transformResetPasswordData(email, otp, newPassword, uid, token);
      const res = await authApi.resetPassword(payload);
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
    const token = tokenStorage.getAccessToken();
    if (!token) {
      console.log("fetchProfile: No access token found");
      return;
    }
    
    try {
      console.log("fetchProfile: Fetching profile with token");
      const profile = await authApi.getProfile();
      console.log("fetchProfile: Raw profile from API:", profile);
      
      const normalizedProfile = normalizeUserProfile(profile);
      console.log("fetchProfile: Normalized profile:", normalizedProfile);
      
      set({ user: normalizedProfile, isAuthenticated: true });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      if (err.response?.status === 401) {
        get().logout();
      }
    }
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.updateProfile(data);
      const normalizedProfile = normalizeUserProfile(res.profile || res);
      set({ user: normalizedProfile });
      return normalizedProfile;
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Logout and clear local state
   */
  logout: async () => {
    const refresh = tokenStorage.getRefreshToken();
    if (refresh) {
      try { await authApi.logout(refresh); } catch {}
    }
    
    tokenStorage.clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user: user ? normalizeUserProfile(user) : null, isAuthenticated: !!user }),
  clearError: () => set({ error: null }),
}));
