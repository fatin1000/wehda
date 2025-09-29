import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:"https://wehda.io/api/v1",
  withCredentials: true
});