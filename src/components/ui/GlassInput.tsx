interface GlassInputProps {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}

export default function GlassInput({
  icon,
  trailing,
  children,
}: GlassInputProps) {
  return (
    <div className="group flex items-center gap-3 bg-mist-50/10 border border-white/5 rounded-xl px-4 py-3 focus-within:border-cyan-500/30 transition-colors">
      {icon && (
        <span className="shrink-0 flex items-center text-white/30 group-focus-within:text-cyan-500/70 transition-colors">
          {icon}
        </span>
      )}
      {children}
      {trailing && (
        <span className="shrink-0 flex items-center">{trailing}</span>
      )}
    </div>
  );
}
