import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:import.meta.mode === "development" ? "http://localhost:3500/api/v1" : "http://wehda.tech/api/v1",
    withCredentials: true
});