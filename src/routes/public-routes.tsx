import type { RouteObject } from "react-router-dom";
import { APP_ROUTES } from "@/core/constants/app-routes";
import AboutPage from "@/modules/about/pages/AboutPage";
import ForgotPasswordPage from "@/modules/auth/pages/ForgotPasswordPage";
import LoginPage from "@/modules/auth/pages/LoginPage";
import RegisterPage from "@/modules/auth/pages/RegisterPage";
import HomePage from "@/modules/weather/pages/HomePage";

export const publicRoutes: RouteObject[] = [
  { path: APP_ROUTES.home, element: <HomePage /> },
  { path: APP_ROUTES.login, element: <LoginPage /> },
  { path: APP_ROUTES.register, element: <RegisterPage /> },
  { path: APP_ROUTES.about, element: <AboutPage /> },
  { path: APP_ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
];
