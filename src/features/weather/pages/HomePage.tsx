import WeatherCard from "../components/WeatherCard";
import { useWeatherStore } from "../store/weatherStore";
import ForecastCard from "../components/ForecastCard";
import HourlyForecastCard from "../components/HourlyForecastCard";
import globeImg from "@/assets/globe.png";

export default function HomePage() {
  const hasCurrent = useWeatherStore((s) => s.current);

  return (
    <div
      className={`flex flex-col items-center px-4 transition-all duration-500
      ${hasCurrent ? "pt-8" : "justify-center min-h-[70vh]"}`}
    >
      {!hasCurrent && (
        <img
          src={globeImg}
          alt="ClimaX"
          className="w-72 h-72 sm:w-96 sm:h-96 object-contain select-none pointer-events-none"
        />
      )}

      <WeatherCard />
      <ForecastCard />
      <HourlyForecastCard />
    </div>
  );
}
