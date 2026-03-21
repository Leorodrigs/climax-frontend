import {
  Star,
  X,
  Wind,
  Droplets,
  ArrowUp,
  ArrowDown,
  MapPin,
  Loader2,
} from "lucide-react";
import type { Favorite } from "../types/favorite.types";
import type { CurrentWeather } from "@/features/weather/types/weather.types";

interface Props {
  favorite: Favorite;
  weather?: CurrentWeather;
  isLoadingWeather?: boolean;
  onRemove: (id: string) => void;
}

export default function FavoriteCard({
  favorite,
  weather,
  isLoadingWeather,
  onRemove,
}: Props) {
  return (
    <div className="w-full bg-gray-700/20 backdrop-blur-md rounded-3xl border border-white/10 px-6 py-5 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 shadow-md shrink-0">
          {isLoadingWeather ? (
            <Loader2 size={24} className="text-white/30 animate-spin" />
          ) : weather?.icon ? (
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-12 h-12 object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/10" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1">
            <MapPin size={11} className="text-cyan-400/70" />
            <span>{favorite.country}</span>
          </div>
          <h3 className="text-white font-bold text-xl leading-tight truncate">
            {favorite.cityName}
          </h3>
          <p className="text-white/40 text-sm mt-0.5 capitalize">
            {isLoadingWeather ? "Carregando..." : (weather?.description ?? "—")}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-white leading-none" style={{ fontSize: "3rem" }}>
            {isLoadingWeather ? (
              <span className="text-3xl text-white/30">—</span>
            ) : (
              <>
                {weather?.temp != null ? Math.round(weather.temp) : "—"}
                <span className="text-2xl text-white/60">°C</span>
              </>
            )}
          </div>

          {!isLoadingWeather && weather && (
            <>
              <div className="flex items-center justify-end gap-2 mt-1 text-sm">
                <span className="flex items-center gap-0.5 text-rose-400">
                  <ArrowUp size={12} />
                  {Math.round(weather.tempMax)}°
                </span>
                <span className="flex items-center gap-0.5 text-blue-400">
                  <ArrowDown size={12} />
                  {Math.round(weather.tempMin)}°
                </span>
              </div>
              <div className="flex items-center justify-end gap-3 mt-1 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Droplets size={11} className="text-cyan-400/70" />
                  {weather.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind size={11} className="text-cyan-400/70" />
                  {weather.windSpeed} m/s
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => onRemove(favorite.id)}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all duration-200 cursor-pointer"
        >
          <Star size={12} className="block group-hover:hidden" />
          <X size={12} className="hidden group-hover:block" />
          <span className="text-xs font-semibold">Favorito</span>
        </button>
      </div>
    </div>
  );
}
