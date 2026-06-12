import { Link } from "react-router-dom";
import { User, Mail, ArrowRight } from "lucide-react";
import AuthCard from "../components/AuthCard";
import AuthDivider from "../components/AuthDivider";
import { useRegister } from "../hooks/useRegister";
import { APP_ROUTES } from "@/core/constants/app-routes";
import Toast from "@/shared/components/ui/Toast";
import FormField from "@/shared/components/ui/FormField";
import GlassInput from "@/shared/components/ui/GlassInput";
import PasswordInput from "@/shared/components/ui/PasswordInput";
import GradientButton from "@/shared/components/ui/GradientButton";

export default function RegisterPage() {
  const {
    form,
    isLoading,
    passwordMismatch,
    toast,
    handleChange,
    handleSubmit,
  } = useRegister();

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
                onChange={(event) => handleChange("name", event.target.value)}
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
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="seu@email.com"
                className="flex-1 bg-transparent outline-none text-white placeholder-white/20 text-sm"
              />
            </GlassInput>
          </FormField>

          <PasswordInput
            label="Senha"
            value={form.password}
            onChange={(value) => handleChange("password", value)}
            placeholder="Mínimo 6 caracteres"
          />

          <PasswordInput
            label="Confirmar senha"
            value={form.confirmPassword}
            onChange={(value) => handleChange("confirmPassword", value)}
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
            to={APP_ROUTES.login}
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
