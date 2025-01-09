import axios from "axios";

const isDevelopment = import.meta.env.MODE === "development";
const isPreview =
  window.location.origin.includes("localhost") ||
  window.location.origin.includes("127.0.0.1");

const api = axios.create({
  baseURL:
    isDevelopment || isPreview
      ? import.meta.env.VITE_API_URL
      : import.meta.env.VITE_PROD_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Only log in development
    if (isDevelopment) {
      console.log("Request details:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
        hasToken: !!token,
      });
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CORS headers for development/preview
    if (isDevelopment || isPreview) {
      config.headers["Access-Control-Allow-Origin"] = window.location.origin;
      config.headers["Access-Control-Allow-Credentials"] = true;
    }

    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error("Request interceptor error:", {
        message: error.message,
        code: error.code,
        config: error.config,
      });
    }
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log("Response success:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Only log errors in development
    if (isDevelopment) {
      console.error("Response error:", {
        message: error.message,
        code: error.code,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
              headers: error.response.headers,
            }
          : "No response",
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
    }

    // Handle network errors
    if (!error.response) {
      error.response = {
        data: {
          success: false,
          message: "Network error - please check your connection",
        },
      };
    }

    // Handle CORS errors
    if (
      error.response?.status === 0 ||
      error.message?.includes("Network Error")
    ) {
      error.response = {
        data: {
          success: false,
          message: "Unable to connect to server - CORS or network issue",
        },
      };
    }

    // Handle timeout
    if (error.code === "ECONNABORTED") {
      error.response = {
        data: {
          success: false,
          message: "Request timed out - please try again",
        },
      };
    }

    return Promise.reject(error);
  }
);

export default api;
