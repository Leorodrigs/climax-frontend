import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/core/constants/app-routes";
import { GLOBAL_MESSAGES } from "@/core/constants/messages";
import { weatherService } from "@/modules/weather/services/weather.service";
import { useWeatherStore } from "@/modules/weather/store/weatherStore";
import type { CurrentWeather } from "@/modules/weather/types/weather.types";
import { useToast } from "@/shared/hooks/useToast";
import { favoritesService } from "../services/favorites.service";
import type { Favorite } from "../types/favorite.types";

type WeatherMap = Record<string, CurrentWeather>;
type LoadingMap = Record<string, boolean>;

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [weatherMap, setWeatherMap] = useState<WeatherMap>({});
  const [loadingMap, setLoadingMap] = useState<LoadingMap>({});
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();
  const showToast = toast.show;
  const navigate = useNavigate();
  const { setCurrent, setForecast, setSelectedCity, setLoading, setError } =
    useWeatherStore();

  const fetchWeatherForFavorites = useCallback(async (items: Favorite[]) => {
    const initialLoading = items.reduce<LoadingMap>(
      (acc, favorite) => ({ ...acc, [favorite.id]: true }),
      {},
    );
    setLoadingMap(initialLoading);

    await Promise.allSettled(
      items.map(async (favorite) => {
        try {
          const response = await weatherService.getCurrent(
            favorite.lat,
            favorite.lon,
          );
          setWeatherMap((prev) => ({ ...prev, [favorite.id]: response.data }));
        } catch {
          setWeatherMap((prev) => {
            const next = { ...prev };
            delete next[favorite.id];
            return next;
          });
        } finally {
          setLoadingMap((prev) => ({ ...prev, [favorite.id]: false }));
        }
      }),
    );
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await favoritesService.getAll();
      setFavorites(response.data);
      if (response.data.length > 0) {
        void fetchWeatherForFavorites(response.data);
      }
    } catch {
      showToast("Não foi possível carregar os favoritos.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchWeatherForFavorites, showToast]);

  useEffect(() => {
    void fetchFavorites();
  }, [fetchFavorites]);

  async function handleRemove(id: string) {
    try {
      await favoritesService.remove(id);
      setFavorites((prev) => prev.filter((favorite) => favorite.id !== id));
      setWeatherMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      showToast("Cidade removida dos favoritos.", "success");
    } catch {
      showToast("Não foi possível remover o favorito.");
    }
  }

  async function handleSelectFavorite(favorite: Favorite) {
    setSelectedCity({
      name: favorite.cityName,
      lat: favorite.lat,
      lon: favorite.lon,
      country: favorite.country,
    });

    setLoading(true);
    setError(null);
    navigate(APP_ROUTES.home);

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        weatherService.getCurrent(favorite.lat, favorite.lon),
        weatherService.getForecast(favorite.lat, favorite.lon),
      ]);
      setCurrent(weatherResponse.data);
      setForecast(forecastResponse.data);
    } catch {
      setError(GLOBAL_MESSAGES.weatherLoadError);
    } finally {
      setLoading(false);
    }
  }

  return {
    favorites,
    weatherMap,
    loadingMap,
    isLoading,
    toast,
    handleRemove,
    handleSelectFavorite,
  };
}
