import axios from "axios";

// Environment configuration
const isDevelopment = import.meta.env.MODE === "development";
const isPreview = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1");
const isDebugEnabled = import.meta.env.VITE_API_DEBUG === "true";

// URL utilities
const cleanUrl = (url = "") => {
  // Remove trailing and leading slashes
  url = url.replace(/^\/+|\/+$/g, "");
  // Remove any occurrence of double /api/api/
  url = url.replace(/\/api\/api\//g, "/api/");
  // Remove any occurrence of api/api at the start
  url = url.replace(/^api\/api\//, "api/");
  // Remove any occurrence of /api/ at the start if baseURL already includes it
  if (url.startsWith('api/')) {
    url = url.substring(4);
  }
  return url;
};

const buildBaseUrl = () => {
  const baseUrl = isDevelopment || isPreview
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  // Ensure base URL doesn't end with /api
  return baseUrl.replace(/\/api$/, "");
};

// Create axios instance
const api = axios.create({
  baseURL: `${buildBaseUrl()}/api`, // Add /api here once
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

// Debug utility
const debugLog = (message, data) => {
  if (isDevelopment || isDebugEnabled) {
    console.log(`[API Debug] ${message}:`, data);
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Authentication
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Clean up URL to prevent double /api
    const originalUrl = config.url;
    config.url = cleanUrl(config.url);

    // Ensure we're not adding /api again if it's already in the URL
    if (config.url.startsWith('api/')) {
      config.url = config.url.substring(4);
    }

    // Debug logging
    debugLog("Request Configuration", {
      originalUrl,
      cleanedUrl: config.url,
      fullUrl: `${config.baseURL}/${config.url}`,
      method: config.method,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    debugLog("Request Error", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    debugLog("Response Success", {
      url: response.config.url,
      fullUrl: `${response.config.baseURL}/${response.config.url}`,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // Enhanced error handling
    const errorResponse = {
      message: "An error occurred",
      details: null,
      originalError: error,
    };

    if (!error.response) {
      errorResponse.message = "Network error - please check your connection";
    } else if (error.response.status === 404) {
      const requestUrl = error.config.url;
      const fullUrl = `${error.config.baseURL}/${requestUrl}`;
      errorResponse.message = "Resource not found";
      errorResponse.details = `The requested resource was not found: ${fullUrl}`;
      
      // Log detailed information about the 404 error
      debugLog("404 Error Details", {
        requestUrl,
        fullUrl,
        originalUrl: error.config.url,
        baseURL: error.config.baseURL,
        headers: error.config.headers,
      });
    } else if (error.code === "ECONNABORTED") {
      errorResponse.message = "Request timed out - please try again";
    }

    debugLog("Response Error", {
      ...errorResponse,
      config: error.config,
      status: error.response?.status,
    });

    error.response = {
      ...error.response,
      data: errorResponse,
    };

    return Promise.reject(error);
  }
);

// Export configured instance
export default api;

// Export utilities for testing
export const utils = {
  cleanUrl,
  buildBaseUrl,
};
