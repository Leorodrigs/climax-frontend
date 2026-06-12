import { useEffect } from "react";
import { useNotifications } from "@/modules/notifications/hooks/useNotifications";
import { configureApiClient } from "./configureApiClient";

configureApiClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const { setupForegroundHandler } = useNotifications();

  useEffect(() => {
    void setupForegroundHandler();
  }, [setupForegroundHandler]);

  return children;
}
