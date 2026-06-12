import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { favoritesService } from "@/modules/favorites/services/favorites.service";
import { useToast } from "@/shared/hooks/useToast";
import { useWeatherStore } from "../store/weatherStore";

export function useWeatherFavorite() {
  const { current, selectedCity } = useWeatherStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const toast = useToast();

  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [isFavLoading, setIsFavLoading] = useState(false);

  useEffect(() => {
    if (!current || !isAuthenticated) {
      setFavoriteId(null);
      return;
    }

    let isActive = true;
    setFavoriteId(null);

    favoritesService
      .getAll()
      .then((response) => {
        if (!isActive) return;

        const match = response.data.find(
          (favorite) =>
            favorite.cityName.toLowerCase() ===
              current.cityName.toLowerCase() &&
            favorite.country === current.country,
        );

        setFavoriteId(match?.id ?? null);
      })
      .catch(() => {
        if (isActive) {
          setFavoriteId(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [current, isAuthenticated]);

  async function handleToggleFavorite() {
    if (!current) return;

    setIsFavLoading(true);
    try {
      if (favoriteId) {
        await favoritesService.remove(favoriteId);
        setFavoriteId(null);
      } else {
        const response = await favoritesService.create({
          cityName: current.cityName,
          lat: selectedCity?.lat ?? 0,
          lon: selectedCity?.lon ?? 0,
          country: current.country,
        });

        setFavoriteId(response.data.id);
      }
    } catch {
      toast.show("Não foi possível atualizar o favorito.");
    } finally {
      setIsFavLoading(false);
    }
  }

  return {
    favoriteId,
    isAuthenticated,
    isFavLoading,
    toast,
    handleToggleFavorite,
  };
}
