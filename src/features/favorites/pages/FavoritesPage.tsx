import { useCallback, useEffect, useState } from "react";
import { Loader2, Star, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Favorite } from "../types/favorite.types";
import type { CurrentWeather } from "@/features/weather/types/weather.types";
import { favoritesService } from "../services/favorites.service";
import { weatherService } from "@/features/weather/services/weather.service";
import { useWeatherStore } from "@/features/weather/store/weatherStore";
import FavoriteCard from "../components/FavoriteCard";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import EmptyState from "@/components/ui/EmptyState";

type WeatherMap = Record<string, CurrentWeather>;
type LoadingMap = Record<string, boolean>;

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [weatherMap, setWeatherMap] = useState<WeatherMap>({});
  const [loadingMap, setLoadingMap] = useState<LoadingMap>({});
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();
  const { setCurrent, setForecast, setSelectedCity, setLoading, setError } =
    useWeatherStore();

  const fetchWeatherForFavorites = useCallback(async (favs: Favorite[]) => {
    const initialLoading = favs.reduce<LoadingMap>(
      (acc, f) => ({ ...acc, [f.id]: true }),
      {},
    );
    setLoadingMap(initialLoading);

    await Promise.allSettled(
      favs.map(async (fav) => {
        try {
          const res = await weatherService.getCurrent(fav.lat, fav.lon);
          setWeatherMap((prev) => ({ ...prev, [fav.id]: res.data }));
        } catch {
        } finally {
          setLoadingMap((prev) => ({ ...prev, [fav.id]: false }));
        }
      }),
    );
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await favoritesService.getAll();
      setFavorites(res.data);
      if (res.data.length > 0) {
        fetchWeatherForFavorites(res.data);
      }
    } catch {
      toast.show("Não foi possível carregar os favoritos.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchWeatherForFavorites]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  async function handleRemove(id: string) {
    try {
      await favoritesService.remove(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
      setWeatherMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.show("Cidade removida dos favoritos.", "success");
    } catch {
      toast.show("Não foi possível remover o favorito.");
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
    navigate("/");

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        weatherService.getCurrent(favorite.lat, favorite.lon),
        weatherService.getForecast(favorite.lat, favorite.lon),
      ]);
      setCurrent(weatherRes.data);
      setForecast(forecastRes.data);
    } catch {
      setError("Não foi possível carregar o clima. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="text-cyan-400 animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={<Star size={36} className="text-amber-400/85" />}
            iconContainerClassName="border-amber-400 bg-yellow-100/40"
            title="Nenhuma cidade favorita"
            description="Você ainda não salvou nenhuma cidade. Pesquise por uma cidade na barra de busca e adicione-a aos favoritos."
            action={
              <Link
                to="/"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 transition-colors"
              >
                <Search size={15} className="text-white/30 shrink-0" />
                <span>
                  Use a barra de busca no topo para encontrar cidades.
                </span>
              </Link>
            }
          />
        ) : (
          <>
            <p className="text-white/50 text-sm">
              {favorites.length}{" "}
              {favorites.length === 1 ? "cidade favorita" : "cidades favoritas"}
            </p>
            {favorites.map((fav) => (
              <FavoriteCard
                key={fav.id}
                favorite={fav}
                weather={weatherMap[fav.id]}
                isLoadingWeather={loadingMap[fav.id]}
                onRemove={handleRemove}
                onSelect={() => handleSelectFavorite(fav)}
              />
            ))}
          </>
        )}
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={toast.hide}
        type={toast.type}
      />
    </div>
  );
}
