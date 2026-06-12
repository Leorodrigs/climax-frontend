import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/core/constants/app-routes";
import { useToast } from "@/shared/hooks/useToast";
import { loginSchema } from "../form/login.schema";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import type { LoginForm } from "../form/login.schema";

export function useLogin() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    APP_ROUTES.home;

  function handleChange(field: keyof LoginForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      toast.show(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(result.data);
      setToken(response.data.accessToken);
      navigate(from, { replace: true });
    } catch {
      toast.show("E-mail ou senha inválidos.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    form,
    isLoading,
    toast,
    handleChange,
    handleSubmit,
  };
}
