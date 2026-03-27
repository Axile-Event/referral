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
  },

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
  },

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

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
