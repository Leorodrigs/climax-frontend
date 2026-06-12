import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import AuthCard from "../components/AuthCard";
import AuthDivider from "../components/AuthDivider";
import { useLogin } from "../hooks/useLogin";
import { APP_ROUTES } from "@/core/constants/app-routes";
import Toast from "@/shared/components/ui/Toast";
import FormField from "@/shared/components/ui/FormField";
import GlassInput from "@/shared/components/ui/GlassInput";
import PasswordInput from "@/shared/components/ui/PasswordInput";
import GradientButton from "@/shared/components/ui/GradientButton";

export default function LoginPage() {
  const { form, isLoading, toast, handleChange, handleSubmit } = useLogin();

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
            labelTrailing={
              <Link
                to={APP_ROUTES.forgotPassword}
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
            to={APP_ROUTES.register}
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
