import { apiClient } from "@/core/api/api-client";
import type { ApiResponse } from "@/core/@types/http.types";
import { API_ENDPOINTS } from "@/core/constants/api-endpoints";
import type { SaveNotificationTokenPayload } from "../types/notification.types";

export const notificationsService = {
  saveToken: (fcmToken: string): ApiResponse<void> => {
    const payload: SaveNotificationTokenPayload = { token: fcmToken };

    return apiClient.post<void>(API_ENDPOINTS.notifications.token, payload);
  },
};
