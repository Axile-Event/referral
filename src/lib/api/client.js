import axios from "axios";
import { API_BASE_URL } from "@/lib/api/baseUrl";

/**
 * Axios API Client
 *
 * Config: Base URL from env, 10s timeout, JSON headers
 * Interceptors:
 * - Request: Attach auth token from localStorage
 * - Response: Handle 401 (logout), 500 (error toast)
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach bearer token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("axile_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle errors and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("axile_refresh");
        if (!refresh) throw new Error("No refresh token");

        // Attempt to refresh access token using refresh token
        const res = await axios.post(
          `${apiClient.defaults.baseURL}/token/refresh/`,
          { refresh }
        );

        if (res.data.access) {
          localStorage.setItem("axile_token", res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("axile_token");
          localStorage.removeItem("axile_refresh");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
