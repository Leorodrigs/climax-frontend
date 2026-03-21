import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { useNotifications } from "@/hooks/useNotifications";

export default function App() {
  const { setupForegroundHandler } = useNotifications();

  useEffect(() => {
    setupForegroundHandler();
  }, []);

  return <RouterProvider router={router} />;
}
