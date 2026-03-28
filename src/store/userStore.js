import { create } from "zustand";
import { userApi } from "@/lib/api/user";
import toast from "react-hot-toast";

const toastTheme = {
  style: {
    background: "#161622",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
};

export const useUserStore = create((set) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const { data } = await userApi.getProfile();
      set({ profile: data });
    } catch {
      toast.error("Failed to load profile", toastTheme);
    } finally {
      set({ isLoading: false });
    }
  },

  changePassword: async (old_password, new_password) => {
    set({ isLoading: true });
    try {
      await userApi.changePassword(old_password, new_password);
      toast.success("Password updated successfully!", toastTheme);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password", toastTheme);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  setPin: async (pin) => {
    set({ isLoading: true });
    try {
      await userApi.setPin(pin);
      toast.success("PIN set successfully!", toastTheme);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to set PIN", toastTheme);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePin: async (old_pin, new_pin) => {
    set({ isLoading: true });
    try {
      await userApi.changePin(old_pin, new_pin);
      toast.success("PIN updated successfully!", toastTheme);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update PIN", toastTheme);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPin: async () => {
    set({ isLoading: true });
    try {
      await userApi.forgotPin();
      toast.success("Check your email for recovery instructions", toastTheme);
    } catch {
      toast.error("Failed to initiate PIN recovery", toastTheme);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async (refresh) => {
    set({ isLoading: true });
    try {
      await userApi.logout(refresh);
      localStorage.removeItem("axile_token");
      localStorage.removeItem("axile_refresh");
      window.location.href = "/login";
    } catch {
      // Direct logout if API fails
      localStorage.removeItem("axile_token");
      localStorage.removeItem("axile_refresh");
      window.location.href = "/login";
    }
  },
}));
