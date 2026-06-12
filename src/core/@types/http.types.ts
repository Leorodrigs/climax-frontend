import type { AxiosResponse } from "axios";

export type ApiResponse<T> = Promise<AxiosResponse<T>>;

export interface IdResponseDTO {
  id: string;
}

export interface MessageResponseDTO {
  message: string;
}
