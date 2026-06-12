interface FormFieldProps {
  label: string;
  labelTrailing?: React.ReactNode;
  children: React.ReactNode;
}

export default function FormField({
  label,
  labelTrailing,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {labelTrailing ? (
        <div className="flex items-center justify-between">
          <label className="text-white/50 text-xs tracking-widest uppercase">
            {label}
          </label>
          {labelTrailing}
        </div>
      ) : (
        <label className="text-white/50 text-xs tracking-widest uppercase">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
