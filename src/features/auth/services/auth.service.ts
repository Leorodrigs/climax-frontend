import { api } from "@/lib/axios";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordDto {
  email: string;
  password: string;
}

export const authService = {
  login: (dto: LoginDto) =>
    api.post<{ accessToken: string }>("/auth/login", dto),

  register: (dto: RegisterDto) =>
    api.post<{ id: string }>("/auth/register", dto),

  resetPassword: (dto: ResetPasswordDto) =>
    api.post<{ message: string }>("/auth/reset-password", dto),
};
