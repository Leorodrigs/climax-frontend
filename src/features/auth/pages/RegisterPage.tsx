import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, ArrowRight } from "lucide-react";
import { z } from "zod";
import { authService } from "../services/auth.service";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import AuthCard from "@/components/ui/AuthCard";
import AuthDivider from "@/components/ui/AuthDivider";
import FormField from "@/components/ui/FormField";
import GlassInput from "@/components/ui/GlassInput";
import PasswordInput from "@/components/ui/PasswordInput";
import GradientButton from "@/components/ui/GradientButton";

const registerSchema = z
  .object({
    name: z.string().min(2, "Insira seu nome completo."),
    email: z
      .string()
      .min(1, "Insira seu e-mail.")
      .email("Insira um e-mail válido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  function handleChange(field: keyof RegisterForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      toast.show(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      });
      toast.show("Conta criada com sucesso! Faça seu login.", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      toast.show("Não foi possível criar a conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center my-1 px-4">
      <AuthCard
        title="Criar conta"
        subtitle="Comece a usar o ClimaX hoje mesmo"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Nome">
            <GlassInput icon={<User size={16} />}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Seu nome completo"
                className="flex-1 bg-transparent outline-none text-white placeholder-white/20 text-sm"
              />
            </GlassInput>
          </FormField>

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
            placeholder="Mínimo 6 caracteres"
          />

          <PasswordInput
            label="Confirmar senha"
            value={form.confirmPassword}
            onChange={(v) => handleChange("confirmPassword", v)}
            placeholder="Repita sua senha"
            error={passwordMismatch ? "As senhas não coincidem" : undefined}
          />

          <GradientButton isLoading={isLoading}>
            Criar conta <ArrowRight size={16} />
          </GradientButton>
        </form>

        <AuthDivider />

        <p className="text-center text-sm text-white/40">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Entrar
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
