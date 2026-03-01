import axios from "axios";

// Using a relative URL because of the Vite proxy configuration
const API_URL = "/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  (config) => {
    try {
      const authData = localStorage.getItem("dupi-auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        const token = parsed.state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error reading auth token from localStorage", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh or clear state on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === "/auth/refresh" || originalRequest.url === "/auth/login") {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data;
        
        // Import useAuthStore dynamically to avoid circular dependencies
        const { useAuthStore } = await import("../store/auth.store");
        useAuthStore.getState().setAccessToken(accessToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, user needs to login again
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
