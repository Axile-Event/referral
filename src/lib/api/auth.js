import apiClient from "./client";
import { tokenStorage } from "@/lib/utils/tokenStorage";

/**
 * Auth API Methods (Referee)
 * Aligned with API_DOCUMENTATION.MD
 */

export const authApi = {
  // POST /referee/signup/ — Username, Firstname, Lastname, Phone, Email, Password
  signup: (data) => apiClient.post("/referee/signup/", data).then((r) => r.data),

  // POST /referee/verify-otp/ — Email, otp
  verifyOtp: (payload) => 
    apiClient.post("/referee/verify-otp/", payload)
      .catch(async (err) => {
        // Fallback to root endpoint if namespaced fails or returns 404
        if (err.response?.status === 404 || err.response?.status === 400) {
           const baseUrl = apiClient.defaults.baseURL;
           const axios = require("axios");
           return axios.post(`${baseUrl}/verify-otp/`, payload);
        }
        throw err;
      })
      .then((r) => r.data),

  // POST /referee/login/ — Email, Password
  login: (payload) =>
    apiClient.post("/referee/login/", payload)
      .catch(async (err) => {
        // Fallback to root endpoint if namespaced fails
        if (err.response?.status === 404 || err.response?.status === 401) {
           const baseUrl = apiClient.defaults.baseURL;
           const axios = require("axios");
           return axios.post(`${baseUrl}/login/`, payload);
        }
        throw err;
      })
      .then((r) => r.data),

  // POST /referee/google-signup/ — { "token", "access_token", "Token" }
  googleSignup: (payload) =>
    apiClient.post("/referee/google-signup/", payload).then((r) => r.data),

  // POST /referee/resend-otp/ — { "email" }
  resendOtp: (email) => 
    apiClient.post("/referee/resend-otp/", { email }).then((r) => r.data),

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

  // POST /referee/password/reset/ — { "email" }
  forgotPassword: (email) => 
    apiClient.post("/referee/password/reset/", { email }).then((r) => r.data),

  // POST /referee/password/reset/verify-otp/ — { "email", "otp" }
  verifyResetOtp: (payload) => 
    apiClient.post("/referee/password/reset/verify-otp/", payload).then((r) => r.data),

  // POST /referee/password/set/ — { "new_password", "email", "otp" }
  resetPassword: (payload) => 
    apiClient.post("/referee/password/set/", payload)
      .catch(async (err) => {
        // Fallback to simpler endpoint if namespaced fails
        if (err.response?.status === 404) {
           const baseUrl = apiClient.defaults.baseURL;
           const axios = require("axios");
           const simpleClient = axios.create({ baseURL: baseUrl });
           return simpleClient.post("/password/set/", payload);
        }
        throw err;
      })
      .then((r) => r.data),
};
