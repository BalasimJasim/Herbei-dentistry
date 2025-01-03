import API_URL from "./config";
import axios from "axios";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getServices = async () => {
  try {
    const response = await api.get("/api/services");
    return response.data;
  } catch (error) {
    console.error("Failed to load services:", error);
    throw error;
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await api.post("/api/services", serviceData);
    return response.data;
  } catch (error) {
    console.error("Failed to create service:", error);
    throw error;
  }
};
