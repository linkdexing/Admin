import axios from "axios";

const baseURL = "http://localhost:4000";

export const publicApi = axios.create({
  baseURL,
});

export const privateApi = axios.create({
  baseURL,
});

privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("linkdexing_admin_token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
