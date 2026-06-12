import type { RouteObject } from "react-router-dom";
import { APP_ROUTES } from "@/core/constants/app-routes";
import AlertsPage from "@/modules/alerts/pages/AlertsPage";
import FavoritesPage from "@/modules/favorites/pages/FavoritesPage";
import PrivateRoute from "./private-route";

export const privateRoutes: RouteObject = {
  element: <PrivateRoute />,
  children: [
    { path: APP_ROUTES.alerts, element: <AlertsPage /> },
    { path: APP_ROUTES.favorites, element: <FavoritesPage /> },
  ],
};
