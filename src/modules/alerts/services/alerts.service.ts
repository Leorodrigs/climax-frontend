import { apiClient } from "@/core/api/api-client";
import type { ApiResponse } from "@/core/@types/http.types";
import { API_ENDPOINTS } from "@/core/constants/api-endpoints";
import type { Alert, CreateAlertPayload } from "../types/alert.types";

export const alertsService = {
  create: (payload: CreateAlertPayload): ApiResponse<Alert> =>
    apiClient.post<Alert>(API_ENDPOINTS.alerts.base, payload),

  getAll: (): ApiResponse<Alert[]> =>
    apiClient.get<Alert[]>(API_ENDPOINTS.alerts.base),

  toggle: (id: string): ApiResponse<Alert> =>
    apiClient.patch<Alert>(API_ENDPOINTS.alerts.toggle(id)),

  remove: (id: string): ApiResponse<void> =>
    apiClient.delete<void>(API_ENDPOINTS.alerts.byId(id)),
};
