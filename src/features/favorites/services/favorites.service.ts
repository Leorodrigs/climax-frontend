import { api } from "@/lib/axios";
import type { CreateFavoritePayload, Favorite } from "../types/favorite.types";

export const favoritesService = {
  getAll: () => api.get<Favorite[]>("/favorites"),
  create: (payload: CreateFavoritePayload) =>
    api.post<Favorite>("/favorites", payload),
  remove: (id: string) => api.delete(`/favorites/${id}`),
};
