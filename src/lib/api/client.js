import axios from "axios";

/**
 * Axios API Client
 *
 * Config: Base URL from env, 10s timeout, JSON headers
 * Interceptors:
 * - Request: Attach auth token from localStorage
 * - Response: Handle 401 (logout), 500 (error toast)
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://youdoc.onrender.com", // Fallback to Render dev backend
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

// Response interceptor: handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: Trigger logout via useAuthStore
      if (typeof window !== "undefined") {
        localStorage.removeItem("axile_token");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
