import { api } from "@/lib/axios";

export const notificationsService = {
  saveToken: (fcmToken: string) =>
    api.post("/notifications/token", { token: fcmToken }),
};
