import WeatherCard from "../components/WeatherCard";
import { useWeatherStore } from "../store/weatherStore";
import ForecastCard from "../components/ForecastCard";
import HourlyForecastCard from "../components/HourlyForecastCard";
import globeImg from "@/assets/globe.png";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const hasCurrent = useWeatherStore((s) => s.current);

  return (
    <div
      className={`flex flex-col items-center px-4 transition-all duration-500
      ${hasCurrent ? "pt-8" : "justify-center min-h-[70vh]"}`}
    >
      {!hasCurrent && (
        <>
          <img
            src={globeImg}
            alt="ClimaX"
            className="w-72 h-72 sm:w-96 sm:h-96 object-contain select-none pointer-events-none"
          />

          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 transition-colors"
          >
            <Search size={15} className="text-white/30 shrink-0" />
            <span>Use a barra de busca no topo para encontrar cidades.</span>
          </Link>
        </>
      )}

      <WeatherCard />
      <ForecastCard />
      <HourlyForecastCard />
    </div>
  );
}
