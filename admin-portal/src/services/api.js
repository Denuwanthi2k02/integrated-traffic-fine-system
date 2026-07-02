import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAdminSummary = async (filters = {}) => {
  const response = await api.get("/admin/summary", { params: filters });
  return response.data;
};

export const getDistrictCollections = async (filters = {}) => {
  const response = await api.get("/admin/districts", { params: filters });
  return response.data;
};

export const getCategoryBreakdown = async (filters = {}) => {
  const response = await api.get("/admin/categories", { params: filters });
  return response.data;
};

export const getMonthlyTrend = async (filters = {}) => {
  const response = await api.get("/admin/monthly", { params: filters });
  return response.data;
};

export const getRecentTransactions = async (filters = {}) => {
  const response = await api.get("/admin/transactions", { params: filters });
  return response.data;
};

export const loginAdmin = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export default api;
