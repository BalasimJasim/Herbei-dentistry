import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
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

    // Log request details
    console.log("Request details:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      hasToken: !!token,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Remove problematic header
    delete config.headers["Access-Control-Allow-Credentials"];

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", {
      message: error.message,
      code: error.code,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("Response success:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // Log the full error details
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

    // Handle network errors
    if (!error.response) {
      error.response = {
        data: {
          success: false,
          message: "Network error - please check your connection",
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
