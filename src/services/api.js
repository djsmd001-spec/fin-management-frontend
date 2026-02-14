import axios from "axios";

const API = axios.create({
  baseURL: "https://fin-management-backend-production.up.railway.app/api",
});

// 🔥 Add Token Automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
