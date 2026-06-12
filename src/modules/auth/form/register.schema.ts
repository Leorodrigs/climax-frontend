import { z } from "zod";

export const registerSchema = z
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

export type RegisterForm = z.infer<typeof registerSchema>;
