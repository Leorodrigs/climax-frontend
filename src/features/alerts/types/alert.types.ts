export type AlertType =
  | "TEMPERATURE_BELOW"
  | "TEMPERATURE_ABOVE"
  | "STORM"
  | "RAIN";

export interface CreateAlertPayload {
  cityName: string;
  lat: number;
  lon: number;
  alertType: AlertType;
  thresholdValue?: number;
}

export interface Alert {
  id: string;
  cityName: string;
  lat: number;
  lon: number;
  alertType: AlertType;
  thresholdValue?: number;
  isActive: boolean;
  createdAt: string;
}
