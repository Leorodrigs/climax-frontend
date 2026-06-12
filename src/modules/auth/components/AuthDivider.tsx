interface AuthDividerProps {
  text?: string;
}

export default function AuthDivider({ text = "ou" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-white/20 text-xs">{text}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}
