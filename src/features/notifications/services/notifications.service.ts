import { api } from "@/lib/axios";

export const notificationsService = {
  /**
   * Saves the FCM token to the backend so the server can send
   * push notifications to this device when alerts are triggered.
   *
   * Backend endpoint needed: POST /notifications/fcm-token
   * Body: { fcmToken: string }
   */
  saveToken: (fcmToken: string) =>
    api.post("/notifications/token", { fcmToken }),
};
