import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/core/constants/app-routes";
import { useToast } from "@/shared/hooks/useToast";
import { resetPasswordSchema } from "../form/reset-password.schema";
import { authService } from "../services/auth.service";
import type { ResetPasswordForm } from "../form/reset-password.schema";

export function useForgotPassword() {
  const [form, setForm] = useState<ResetPasswordForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  function handleChange(field: keyof ResetPasswordForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = resetPasswordSchema.safeParse(form);
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
      setTimeout(() => navigate(APP_ROUTES.login), 2000);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response
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

  return {
    form,
    isLoading,
    passwordMismatch,
    toast,
    handleChange,
    handleSubmit,
  };
}
