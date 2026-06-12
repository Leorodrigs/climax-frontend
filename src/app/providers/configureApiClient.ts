import { configureApiClientAuth } from "@/core/api/api-client";
import { APP_ROUTES } from "@/core/constants/app-routes";
import { useAuthStore } from "@/modules/auth/store/authStore";

export function configureApiClient() {
  configureApiClientAuth({
    getToken: () => useAuthStore.getState().token,
    onUnauthorized: () => {
      useAuthStore.getState().logout();
      window.location.href = APP_ROUTES.login;
    },
  });
}
