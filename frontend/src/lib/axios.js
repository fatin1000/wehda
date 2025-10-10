import axios from "axios";

export const axiosInstance = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.NODE_ENV === "production" ?"https://wehda.io/api/v1/" : "http://localhost:3500/api/v1/",
  withCredentials: true
});