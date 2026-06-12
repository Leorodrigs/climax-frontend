import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Insira seu e-mail.")
    .email("Insira um e-mail válido."),
  password: z.string().min(1, "Insira sua senha."),
});

export type LoginForm = z.infer<typeof loginSchema>;
