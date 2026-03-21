import { api } from "@/lib/axios";
import type { Alert, CreateAlertPayload } from "../types/alert.types";

export const alertsService = {
  create: (payload: CreateAlertPayload) => api.post<Alert>("/alerts", payload),
  getAll: () => api.get<Alert[]>("/alerts"),
  toggle: (id: string) => api.patch<Alert>(`/alerts/${id}/toggle`),
  remove: (id: string) => api.delete(`/alerts/${id}`),
};
