import { Loader2 } from "lucide-react";

interface GradientButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function GradientButton({
  isLoading = false,
  disabled,
  type = "submit",
  onClick,
  className = "",
  children,
}: GradientButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled ?? isLoading}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${className}`}
    >
      {isLoading ? <Loader2 size={18} className="animate-spin" /> : children}
    </button>
  );
}
