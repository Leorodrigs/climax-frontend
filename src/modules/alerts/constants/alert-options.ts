import type { AlertType } from "../types/alert.types";

export const ALERT_OPTIONS: { value: AlertType; label: string }[] = [
  { value: "TEMPERATURE_BELOW", label: "Temperatura abaixo de..." },
  { value: "TEMPERATURE_ABOVE", label: "Temperatura acima de..." },
  { value: "STORM", label: "Tempestade" },
  { value: "RAIN", label: "Chuva" },
];

export const NEEDS_THRESHOLD: AlertType[] = [
  "TEMPERATURE_BELOW",
  "TEMPERATURE_ABOVE",
];
