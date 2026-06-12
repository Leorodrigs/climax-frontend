import { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import FormField from "./FormField";
import GlassInput from "./GlassInput";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  labelTrailing?: React.ReactNode;
  error?: string;
}

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder = "••••••••",
  labelTrailing,
  error,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <FormField label={label} labelTrailing={labelTrailing}>
      <GlassInput
        icon={<Lock size={16} />}
        trailing={
          <button
            type="button"
            onClick={() => setShow((p) => !p)}
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          >
            {show ? (
              <EyeOff size={16} className="text-cyan-500/70" />
            ) : (
              <Eye size={16} className="text-white/30" />
            )}
          </button>
        }
      >
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-white placeholder-white/20 text-sm"
        />
      </GlassInput>
      {error && (
        <div className="flex items-center gap-1.5 text-red-500/90">
          <AlertCircle size={14} className="shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </FormField>
  );
}
