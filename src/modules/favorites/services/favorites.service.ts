import { apiClient } from "@/core/api/api-client";
import type { ApiResponse } from "@/core/@types/http.types";
import { API_ENDPOINTS } from "@/core/constants/api-endpoints";
import type { CreateFavoritePayload, Favorite } from "../types/favorite.types";

export const favoritesService = {
  getAll: (): ApiResponse<Favorite[]> =>
    apiClient.get<Favorite[]>(API_ENDPOINTS.favorites.base),

  create: (payload: CreateFavoritePayload): ApiResponse<Favorite> =>
    apiClient.post<Favorite>(API_ENDPOINTS.favorites.base, payload),

  remove: (id: string): ApiResponse<void> =>
    apiClient.delete<void>(API_ENDPOINTS.favorites.byId(id)),
};
