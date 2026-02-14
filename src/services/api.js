import axios from "axios";

const API = axios.create({
  baseURL: "https://fin-management-backend-production.up.railway.app/api",
});

export default API;
