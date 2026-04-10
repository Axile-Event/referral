import apiClient from "./client";
import { tokenStorage } from "@/lib/utils/tokenStorage";

/**
 * Auth API Methods (Referee)
 * Aligned with API_DOCUMENTATION.MD
 */

export const authApi = {
  // Section 2.1: Email/password signup
  signup: (data) => apiClient.post("/referee/signup/", data).then((r) => r.data),
  
  
  // Section 2.1: Verify OTP
  verifyOtp: (payload) => apiClient.post("/verify-otp/", payload).then((r) => r.data),

  // Section 2.2: Login
  login: (payload) => apiClient.post("/login/", payload).then((r) => r.data),

  // Section 2.3: Google (referee)
  googleSignup: (payload) =>
    apiClient.post("/referee/google-signup/", payload).then((r) => r.data),

  // POST /resend-otp/ (Standard Axile pattern)
  resendOtp: (email) => 
    apiClient.post("/resend-otp/", { email }).then((r) => r.data),

  // Section 2.4: Other
  logout: (refresh) => apiClient.post("/logout/", { refresh }).then((r) => r.data),

  // GET/PATCH /referee/profile/
  getProfile: () => apiClient.get("/referee/profile/").then((r) => r.data),
  updateProfile: (data) => apiClient.patch("/referee/profile/", data).then((r) => r.data),

  // Section 2.4: Referee PIN
  createPin: (pin) => apiClient.post("/referee/pin/", { pin }).then((r) => r.data),
  verifyPin: (pin) => apiClient.post("/referee/verify-pin/", { pin }).then((r) => r.data),
  forgotPin: (email) => apiClient.post("/referee/forgot-pin/", { email }).then((r) => r.data),
  changePin: (oldPin, newPin) => 
    apiClient.post("/referee/change-pin/", { old_pin: oldPin, new_pin: newPin }).then((r) => r.data),

  // Section 2.4: Referee password change (authenticated)
  changePassword: (old_password, new_password) => 
    apiClient.post("/password/change/", { old_password, new_password }).then((r) => r.data),

  // Section 2.4: Password reset
  forgotPassword: (email) => 
    apiClient.post("/password/reset/", { email }).then((r) => r.data),

  // Verify Reset OTP & Set New Password
  verifyResetOtp: (payload) => 
    apiClient.post("/password/reset/verify-otp/", payload).then((r) => r.data),
    
  resetPassword: (payload) => 
    apiClient.post("/password/set/", payload).then((r) => r.data),
};
export default authApi;
