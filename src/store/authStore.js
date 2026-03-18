import { create } from "zustand";

/**
 * Auth Store (Zustand)
 *
 * State: user, isAuthenticated, isLoading, error
 * Actions: login, signup, logout, setUser
 *
 * TODO: Connect to authApi.login/signup/logout/getCurrentUser
 */
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: const res = await authApi.login(email, password);
      // set({ user: res.user, isAuthenticated: true });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: const res = await authApi.signup(email, password, name);
      // set({ user: res.user, isAuthenticated: true });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    // TODO: authApi.logout()
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
