import axios from "axios"; // for handling HTTP requests
import { BASE_URL } from "./constants";

// Instance Configurations
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "content-type": "application/json",
  },
});

// Interceptor to set the token in the local storage
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
