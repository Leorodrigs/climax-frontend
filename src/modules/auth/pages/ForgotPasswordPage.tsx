import { Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import AuthCard from "../components/AuthCard";
import AuthDivider from "../components/AuthDivider";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { APP_ROUTES } from "@/core/constants/app-routes";
import Toast from "@/shared/components/ui/Toast";
import FormField from "@/shared/components/ui/FormField";
import GlassInput from "@/shared/components/ui/GlassInput";
import PasswordInput from "@/shared/components/ui/PasswordInput";
import GradientButton from "@/shared/components/ui/GradientButton";

export default function ForgotPasswordPage() {
  const {
    form,
    isLoading,
    passwordMismatch,
    toast,
    handleChange,
    handleSubmit,
  } = useForgotPassword();

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
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="seu@email.com"
                className="flex-1 bg-transparent outline-none text-white placeholder-white/20 text-sm"
              />
            </GlassInput>
          </FormField>

          <AuthDivider text="Nova senha" />

          <PasswordInput
            label="Insira sua nova senha"
            value={form.password}
            onChange={(value) => handleChange("password", value)}
            placeholder="Mínimo 6 caracteres"
          />

          <PasswordInput
            label="Repita a nova senha"
            value={form.confirmPassword}
            onChange={(value) => handleChange("confirmPassword", value)}
            placeholder="Repita a senha acima"
            error={passwordMismatch ? "As senhas não coincidem" : undefined}
          />

          <GradientButton isLoading={isLoading}>
            Redefinir senha <ArrowRight size={16} />
          </GradientButton>
        </form>

        <AuthDivider />

        <Link
          to={APP_ROUTES.login}
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
