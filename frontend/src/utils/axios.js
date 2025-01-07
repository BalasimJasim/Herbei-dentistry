import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Request with token:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      hasToken: !!token,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure CORS headers are handled properly
    config.headers["Access-Control-Allow-Credentials"] = true;

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
    console.log("Response interceptor:", {
      url: response.config.url,
      status: response.status,
      success: response.data?.success,
    });
    return response;
  },
  (error) => {
    console.error("Response interceptor error:", {
      message: error.message,
      code: error.code,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : "No response",
      config: {
        url: error.config?.url,
        method: error.config?.method,
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
