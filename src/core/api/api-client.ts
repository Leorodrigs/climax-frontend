import axios from "axios";

interface ApiClientAuthConfig {
  getToken: () => string | null;
  onUnauthorized: () => void;
  isAuthRoute?: (url: string) => boolean;
}

let isAuthInterceptorConfigured = false;

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    "https://climax-backend-production.up.railway.app/api/v1",
});

export function configureApiClientAuth({
  getToken,
  onUnauthorized,
  isAuthRoute = (url) => url.includes("/auth/"),
}: ApiClientAuthConfig) {
  if (isAuthInterceptorConfigured) return;
  isAuthInterceptorConfigured = true;

  apiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const url = error.config?.url;
      const isAuthRequest = typeof url === "string" && isAuthRoute(url);

      if (error.response?.status === 401 && !isAuthRequest) {
        onUnauthorized();
      }

      return Promise.reject(error);
    },
  );
}
