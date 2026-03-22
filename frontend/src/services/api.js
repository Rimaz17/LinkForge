import axios from "axios";
import { AUTH_STORAGE_KEY } from "../context/AuthContext.jsx";

export const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return config;
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error, fallback = "Something went wrong") {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
}

export default api;