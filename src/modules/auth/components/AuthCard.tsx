interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md bg-gray-700/20 backdrop-blur-md rounded-3xl p-8 border border-white/10">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-white/40 text-sm mb-6">{subtitle}</p>}
      {children}
    </div>
  );
}
