import { useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

type ToastType = "error" | "success";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: ToastType;
}

const config: Record<
  ToastType,
  {
    icon: React.ReactNode;
    border: string;
    background: string;
    textColor: string;
  }
> = {
  error: {
    icon: <AlertCircle size={17} className="text-red-500 shrink-0" />,
    border: "border-red-500/20",
    background: "bg-red-600/15",
    textColor: "text-red-500/80",
  },
  success: {
    icon: <CheckCircle size={17} className="text-emerald-400 shrink-0" />,
    border: "border-emerald-500/20",
    background: "bg-emerald-600/15",
    textColor: "text-emerald-400/80",
  },
};

export default function Toast({
  message,
  isVisible,
  onClose,
  type = "error",
}: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  const { icon, border, background, textColor } = config[type];

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 ${background} backdrop-blur-md border rounded-xl px-4 py-3 shadow-xl shadow-black/30 transition-all duration-300 whitespace-nowrap
        ${border}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
    >
      {icon}
      <span className={`font-semibold text-sm ${textColor}`}>{message}</span>
    </div>
  );
}
