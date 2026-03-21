interface EmptyStateProps {
  icon: React.ReactNode;
  iconContainerClassName?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  iconContainerClassName = "bg-white/5 border-white/10",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-gray-700/20 backdrop-blur-md rounded-3xl border border-white/10 px-8 py-14 flex flex-col items-center text-center gap-6">
      <div
        className={`flex items-center justify-center w-20 h-20 rounded-2xl border ${iconContainerClassName}`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
          {description}
        </p>
      </div>
      {action && action}
    </div>
  );
}
