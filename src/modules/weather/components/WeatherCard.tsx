import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Star,
  Loader2,
} from "lucide-react";
import StatCard from "./StatCard";
import { useWeatherFavorite } from "../hooks/useWeatherFavorite";
import { useWeatherStore } from "../store/weatherStore";
import Toast from "@/shared/components/ui/Toast";

export default function WeatherCard() {
  const { current, selectedCity, isLoading, error } = useWeatherStore();
  const {
    favoriteId,
    isAuthenticated,
    isFavLoading,
    toast,
    handleToggleFavorite,
  } = useWeatherFavorite();

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl bg-gray-700/60 backdrop-blur-md rounded-3xl p-6 border border-white/10 animate-pulse">
        <div className="h-5 bg-white/10 rounded w-24 mb-2" />
        <div className="h-9 bg-white/10 rounded w-48 mb-6" />
        <div className="flex gap-6 mb-6">
          <div className="w-24 h-24 bg-white/10 rounded-2xl" />
          <div className="flex flex-col gap-3 justify-center">
            <div className="h-16 bg-white/10 rounded w-40" />
            <div className="h-5 bg-white/10 rounded w-32" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white/10 rounded-2xl h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl bg-gray-700/60 backdrop-blur-md rounded-3xl p-6 border border-red-500/20 text-red-400 text-center">
        {error}
      </div>
    );
  }

  if (!current) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${current.icon}@2x.png`;
  const stateLabel = selectedCity?.state ? `${selectedCity.state} · ` : "";
  const isFavorited = !!favoriteId;

  return (
    <>
      <div className="w-full max-w-2xl bg-gray-700/20 backdrop-blur-md rounded-3xl p-6 border border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-1 text-cyan-400 text-sm mb-1">
              <MapPin size={14} />
              <span>
                {stateLabel}
                {current.country}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              {current.cityName}
            </h2>
          </div>

          {isAuthenticated && (
            <button
              onClick={handleToggleFavorite}
              disabled={isFavLoading}
              aria-label={
                isFavorited
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
              }
              className="p-1 transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isFavLoading ? (
                <Loader2 size={22} className="text-white/40 animate-spin" />
              ) : (
                <Star
                  size={24}
                  className={`transition-colors duration-300 ${
                    isFavorited
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-white/40 fill-transparent"
                  }`}
                />
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-mist-50/10 rounded-2xl p-3 flex items-center justify-center border border-white/5">
              <img
                src={iconUrl}
                alt={current.description}
                className="w-20 h-20"
              />
            </div>
            <span className="text-white/60 text-sm capitalize">
              {current.description}
            </span>
          </div>

          <div>
            <p className="text-8xl font-thin text-white leading-none">
              {Math.round(current.temp)}
              <span className="text-4xl align-top mt-2 inline-block">°C</span>
            </p>
            <div className="flex items-center gap-3 mt-3 text-sm">
              <span className="text-red-400 font-medium">
                ↑ {Math.round(current.tempMax)}°C
              </span>
              <span className="text-white/20">|</span>
              <span className="text-blue-400 font-medium">
                ↓ {Math.round(current.tempMin)}°C
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Thermometer size={20} className="text-cyan-400" />}
            value={`${Math.round(current.feelsLike)}°C`}
            label="Sensação"
          />
          <StatCard
            icon={<Droplets size={20} className="text-cyan-400" />}
            value={`${current.humidity}%`}
            label="Umidade"
          />
          <StatCard
            icon={<Wind size={20} className="text-cyan-400" />}
            value={`${current.windSpeed} m/s`}
            label="Vento"
          />
        </div>
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={toast.hide}
        type={toast.type}
      />
    </>
  );
}
