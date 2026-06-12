interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export default function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="bg-mist-50/10 rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/5">
      {icon}
      <span className="text-white font-semibold text-lg leading-none">
        {value}
      </span>
      <span className="text-white/40 text-xs tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}
