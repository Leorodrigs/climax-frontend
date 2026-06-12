interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-4 rounded-full bg-cyan-400" />
      <span className="text-white/60 text-xs tracking-widest uppercase font-medium">
        {children}
      </span>
    </div>
  );
}
