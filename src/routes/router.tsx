import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/app/layout/AppLayout";
import { privateRoutes } from "./private-routes";
import { publicRoutes } from "./public-routes";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [...publicRoutes, privateRoutes],
  },
]);
