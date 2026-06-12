import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "@/core/constants/app-routes";
import { useAuthStore } from "@/modules/auth/store/authStore";

export default function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={APP_ROUTES.login} replace />
  );
}
