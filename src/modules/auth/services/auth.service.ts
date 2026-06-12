import { apiClient } from "@/core/api/api-client";
import type {
  ApiResponse,
  IdResponseDTO,
  MessageResponseDTO,
} from "@/core/@types/http.types";
import { API_ENDPOINTS } from "@/core/constants/api-endpoints";
import type {
  LoginPayload,
  LoginResponseDTO,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types/auth.types";

export const authService = {
  login: (payload: LoginPayload): ApiResponse<LoginResponseDTO> =>
    apiClient.post<LoginResponseDTO>(API_ENDPOINTS.auth.login, payload),

  register: (payload: RegisterPayload): ApiResponse<IdResponseDTO> =>
    apiClient.post<IdResponseDTO>(API_ENDPOINTS.auth.register, payload),

  resetPassword: (
    payload: ResetPasswordPayload,
  ): ApiResponse<MessageResponseDTO> =>
    apiClient.post<MessageResponseDTO>(
      API_ENDPOINTS.auth.resetPassword,
      payload,
    ),
};
