import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
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

const resetSchema = z
  .object({
    email: z
      .string()
      .min(1, "Insira seu e-mail.")
      .email("Insira um e-mail válido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua nova senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type ResetForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function ForgotPasswordPage() {
  const [form, setForm] = useState<ResetForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  function handleChange(field: keyof ResetForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = resetSchema.safeParse(form);
    if (!result.success) {
      toast.show(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: result.data.email,
        password: result.data.password,
      });
      toast.show("Senha redefinida com sucesso! Faça seu login.", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 404) {
        toast.show("E-mail não cadastrado.");
      } else {
        toast.show("Não foi possível redefinir a senha. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center my-3 px-4">
      <AuthCard
        title="Redefinir senha"
        subtitle="Informe o e-mail da sua conta e crie uma nova senha."
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="E-mail cadastrado">
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

          <AuthDivider text="Nova senha" />

          <PasswordInput
            label="Insira sua nova senha"
            value={form.password}
            onChange={(v) => handleChange("password", v)}
            placeholder="Mínimo 6 caracteres"
          />

          <PasswordInput
            label="Repita a nova senha"
            value={form.confirmPassword}
            onChange={(v) => handleChange("confirmPassword", v)}
            placeholder="Repita a senha acima"
            error={passwordMismatch ? "As senhas não coincidem" : undefined}
          />

          <GradientButton isLoading={isLoading}>
            Redefinir senha <ArrowRight size={16} />
          </GradientButton>
        </form>

        <AuthDivider />

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <ArrowLeft size={16} /> Voltar para o login
        </Link>
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
