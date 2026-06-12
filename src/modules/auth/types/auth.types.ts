export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
}
