import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import PrivateRoute from "./PrivateRoute";
import HomePage from "@/features/weather/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import AlertsPage from "@/features/alerts/pages/AlertsPage";
import FavoritesPage from "@/features/favorites/pages/FavoritesPage";
import AboutPage from "@/pages/AboutPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "/alerts", element: <AlertsPage /> },
          { path: "/favorites", element: <FavoritesPage /> },
        ],
      },
    ],
  },
]);
