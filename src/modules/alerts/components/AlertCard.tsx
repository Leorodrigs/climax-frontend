import { Bell, Trash2 } from "lucide-react";
import Toggle from "@/shared/components/ui/Toggle";
import type { Alert, AlertType } from "../types/alert.types";

interface Props {
  alert: Alert;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const ALERT_LABELS: Record<AlertType, (threshold?: number) => string> = {
  TEMPERATURE_BELOW: (t) => `Temperatura abaixo de ${t ?? "?"}°C`,
  TEMPERATURE_ABOVE: (t) => `Temperatura acima de ${t ?? "?"}°C`,
  STORM: () => "Tempestade",
  RAIN: () => "Chuva",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month} às ${hour}:${min}`;
}

export default function AlertCard({ alert, onToggle, onDelete }: Props) {
  const label =
    ALERT_LABELS[alert.alertType]?.(alert.thresholdValue) ?? alert.alertType;

  return (
    <div
      className={`flex items-center gap-4 bg-gray-700/20 backdrop-blur-md rounded-2xl border px-4 py-3.5 transition-colors duration-300
        ${alert.isActive ? "border-cyan-500/30" : "border-white/10"}`}
    >
      <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 shrink-0">
        <Bell size={18} className="text-cyan-400" />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-xs sm:text-sm truncate">
          {label}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 font-medium">
            {alert.cityName}
          </span>
          <span className="text-white/30 text-xs">
            · criado em {formatDate(alert.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Toggle
          checked={alert.isActive}
          onChange={() => onToggle(alert.id)}
          ariaLabel={alert.isActive ? "Desativar alerta" : "Ativar alerta"}
        />

        <button
          onClick={() => onDelete(alert.id)}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
