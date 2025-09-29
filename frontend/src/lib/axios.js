import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development"
      ? "http://localhost:3500/api/v1"
      : import.meta.env.VITE_API_URL,
    withCredentials: true
  });