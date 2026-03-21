import { useCallback } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { notificationsService } from "@/features/notifications/services/notifications.service";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;

export function useNotifications() {
  /**
   * Requests notification permission from the browser, gets the FCM token,
   * and saves it to the backend. Returns true if permission was granted.
   *
   * Call this after a user creates their first alert.
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!("Notification" in window)) return false;
    if (!("serviceWorker" in navigator)) return false;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return false;

      const messaging = await getFirebaseMessaging();
      if (!messaging) return false;

      const swRegistration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/" },
      );

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });

      if (token) {
        await notificationsService.saveToken(token);
        return true;
      }

      return false;
    } catch (error) {
      console.warn("[ClimaX] Notification setup failed:", error);
      return false;
    }
  }, []);

  /**
   * Sets up the foreground message handler (app is open/focused).
   * Shows a native Notification when a push arrives while the tab is active.
   *
   * Call once on app mount (only when permission is already granted).
   */
  const setupForegroundHandler = useCallback(async () => {
    if (Notification.permission !== "granted") return;

    const messaging = await getFirebaseMessaging();
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      const title = payload.notification?.title ?? "ClimaX — Alerta Climático";
      const body =
        payload.notification?.body ?? "Uma condição climática foi detectada!";

      new Notification(title, {
        body,
        icon: "/favicon.png",
      });
    });
  }, []);

  return { requestPermission, setupForegroundHandler };
}
