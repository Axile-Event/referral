import apiClient from "./client";
import { tokenStorage } from "@/lib/utils/tokenStorage";

/**
 * Auth API Methods (Referee)
 * Aligned with API_DOCUMENTATION.MD
 */

export const authApi = {
  // POST /referee/signup/ — Username, Firstname, Lastname, Phone, Email, Password
  signup: (data) => apiClient.post("/referee/signup/", data).then((r) => r.data),

  // POST /referee/verify-otp/ — email, otp
  verifyOtp: (email, otp) => 
    apiClient.post("/referee/verify-otp/", { email, otp }).then((r) => r.data),

  // POST /referee/login/ — { "email", "password" }
  login: (email, password) =>
    apiClient.post("/referee/login/", { email, password }).then((r) => r.data),

  // POST /referee/google-signup/ — { "token" }
  googleSignup: (token) =>
    apiClient.post("/referee/google-signup/", { token }).then((r) => r.data),

  // POST /logout/ — { "refresh" }
  logout: (refresh) => apiClient.post("/logout/", { refresh }).then((r) => r.data),

  // GET/PATCH /referee/profile/
  getProfile: () => apiClient.get("/referee/profile/").then((r) => r.data),
  updateProfile: (data) => apiClient.patch("/referee/profile/", data).then((r) => r.data),

  // PIN Operations
  createPin: (pin) => apiClient.post("/referee/pin/", { pin }).then((r) => r.data),
  verifyPin: (pin) => apiClient.post("/referee/verify-pin/", { pin }).then((r) => r.data),
  forgotPin: (email) => apiClient.post("/referee/forgot-pin/", { email }).then((r) => r.data),
  changePin: (oldPin, newPin) => 
    apiClient.post("/referee/change-pin/", { old_pin: oldPin, new_pin: newPin }).then((r) => r.data),
};
