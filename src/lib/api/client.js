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
    console.log(`apiClient: Attaching token to ${config.url}`);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log(`apiClient: No token found for ${config.url}`);
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
      console.warn(`apiClient: 401 Unauthorized on ${originalRequest.url}. Attempting refresh...`);
      originalRequest._retry = true;

      try {
        const refresh = tokenStorage.getRefreshToken();
        if (!refresh || refresh === "undefined" || refresh === "null") {
          console.warn("apiClient: No refresh token available, logging out.");
          tokenStorage.clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }

        // Attempt to refresh access token using refresh token
        console.log("apiClient: Calling refresh endpoint...");
        const res = await axios.post(
          `${API_BASE_URL}/referee/token/refresh/`,
          { refresh }
        ).catch(async (e) => {
            if (e.response?.status === 404) {
                console.log("apiClient: Namespaced refresh 404, trying root...");
                return await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh });
            }
            throw e;
        });

        if (res.data.access) {
          console.log("apiClient: Token refresh successful.");
          tokenStorage.setTokens(res.data.access, refresh);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("apiClient: Token refresh failed, logging out:", refreshError.response?.data || refreshError.message);
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
