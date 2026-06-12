import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/core/constants/app-routes";
import { useToast } from "@/shared/hooks/useToast";
import { registerSchema } from "../form/register.schema";
import { authService } from "../services/auth.service";
import type { RegisterForm } from "../form/register.schema";

export function useRegister() {
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
      setTimeout(() => navigate(APP_ROUTES.login), 2000);
    } catch {
      toast.show("Não foi possível criar a conta. Tente novamente.");
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
