import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import { z } from "zod";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import AuthCard from "@/components/ui/AuthCard";
import AuthDivider from "@/components/ui/AuthDivider";
import FormField from "@/components/ui/FormField";
import GlassInput from "@/components/ui/GlassInput";
import PasswordInput from "@/components/ui/PasswordInput";
import GradientButton from "@/components/ui/GradientButton";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Insira seu e-mail.")
    .email("Insira um e-mail válido."),
  password: z.string().min(1, "Insira sua senha."),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";
  const toast = useToast();

  function handleChange(field: keyof LoginForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      toast.show(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.login(result.data);
      setToken(res.data.accessToken);
      navigate(from, { replace: true });
    } catch {
      toast.show("E-mail ou senha inválidos.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <AuthCard
        title="Bem-vindo de volta"
        subtitle="Acesse sua conta para continuar"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormField label="E-mail">
            <GlassInput icon={<Mail size={16} />}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 bg-transparent outline-none text-white placeholder-white/20 text-sm"
              />
            </GlassInput>
          </FormField>

          <PasswordInput
            label="Senha"
            value={form.password}
            onChange={(v) => handleChange("password", v)}
            labelTrailing={
              <Link
                to="/forgot-password"
                className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            }
          />

          <GradientButton isLoading={isLoading}>
            Entrar <ArrowRight size={16} />
          </GradientButton>
        </form>

        <AuthDivider />

        <p className="text-center text-sm text-white/40">
          Não tem uma conta?{" "}
          <Link
            to="/register"
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Criar conta
          </Link>
        </p>
      </AuthCard>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={toast.hide}
        type={toast.type}
      />
    </div>
  );
}
