import axios from "axios";
import { useAuthStore } from "@/features/auth/store/authStore";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    "https://climax-backend-production.up.railway.app/api/v1",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/auth/");

    if (error.response?.status === 401 && !isAuthRoute) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
