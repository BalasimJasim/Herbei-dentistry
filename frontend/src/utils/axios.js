import axios from 'axios'
import API_URL from "../api/config";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log("API Request:", {
    url: config.url,
    baseURL: config.baseURL,
    method: config.method,
  });
  return config;
});

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data)
      toast.error(error.response.data.message || 'An error occurred')
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request)
      toast.error('Network error. Please check your connection.')
    } else {
      // Something else happened
      console.error('Error:', error.message)
      toast.error('An unexpected error occurred')
    }
    return Promise.reject(error)
  }
)

export default api 