import axios from "axios";
import { API_BASE_URL } from "@/lib/api/baseUrl";
import { tokenStorage } from "@/lib/utils/tokenStorage";

/**
 * Axios API Client
 *
 * Config: Base URL from env, 10s timeout, JSON headers
 * Interceptors:
 * - Request: Attach auth token from localStorage via tokenStorage
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
  const token = tokenStorage.getAccessToken();
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle errors and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    const isAuthPath = originalRequest.url?.includes("/login") || 
                       originalRequest.url?.includes("/signup") || 
                       originalRequest.url?.includes("/verify-otp") ||
                       originalRequest.url?.includes("/google-signup");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthPath) {
      originalRequest._retry = true;

      try {
        const refresh = tokenStorage.getRefreshToken();
        if (!refresh || refresh === "undefined" || refresh === "null") {
          // No refresh token available, just reject
          return Promise.reject(error);
        }

        // Attempt to refresh access token using refresh token
        // Most referee endpoints are namespaced under /referee/
        const res = await axios.post(
          `${API_BASE_URL}/referee/token/refresh/`,
          { refresh }
        ).catch(async (e) => {
            // Fallback to top-level if namespaced fails
            if (e.response?.status === 404) {
                return await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh });
            }
            throw e;
        });

        if (res.data.access) {
          tokenStorage.setTokens(res.data.access, refresh); // Keep same refresh
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        console.error("Token refresh failed:", refreshError.response?.data || refreshError.message);
        tokenStorage.clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
