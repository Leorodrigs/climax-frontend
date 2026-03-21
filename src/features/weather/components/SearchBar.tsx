import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { weatherService } from "../services/weather.service";
import { useWeatherStore } from "../store/weatherStore";
import type { CitySuggestion } from "../types/weather.types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const containerRef = useRef<HTMLDivElement>(null);

  const justSelectedRef = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    suggestions,
    setSuggestions,
    clearSuggestions,
    setSelectedCity,
    setCurrent,
    setForecast,
    setLoading,
    setError,
  } = useWeatherStore();

  useEffect(() => {
    if (justSelectedRef.current) return;

    if (debouncedQuery.length < 2) {
      clearSuggestions();
      return;
    }
    setIsFetching(true);
    weatherService
      .search(debouncedQuery)
      .then((res) => setSuggestions(res.data))
      .catch(() => clearSuggestions())
      .finally(() => setIsFetching(false));
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        clearSuggestions();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInputChange(value: string) {
    justSelectedRef.current = false;
    setQuery(value);
  }

  async function handleSelectCity(city: CitySuggestion) {
    justSelectedRef.current = true;

    setSelectedCity(city);
    setQuery(`${city.name}, ${city.country}`);
    clearSuggestions();
    setLoading(true);
    setError(null);

    if (location.pathname !== "/") {
      navigate("/");
    }

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        weatherService.getCurrent(city.lat, city.lon),
        weatherService.getForecast(city.lat, city.lon),
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
    <div ref={containerRef} className="relative w-full min-w-0">
      <div className="flex items-center gap-2 bg-mist-50/60 border border-mist-100 rounded-xl px-3 py-2 shadow-md transition-all duration-300 focus-within:bg-slate-50">
        {isFetching ? (
          <Loader2 size={15} className="text-slate-400 animate-spin shrink-0" />
        ) : (
          <Search size={15} className="text-slate-500 shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Cidade..."
          className="flex-1 min-w-0 outline-none text-slate-800 placeholder-slate-400 bg-transparent text-sm truncate"
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">
          {suggestions.map((city, i) => (
            <li key={i}>
              <button
                onClick={() => handleSelectCity(city)}
                className="w-full text-left px-4 py-3 hover:bg-cyan-50 transition-colors flex items-center justify-between gap-2"
              >
                <span className="text-gray-800 text-sm truncate">
                  {city.name}
                  {city.state ? `, ${city.state}` : ""}
                </span>
                <span className="text-xs text-gray-400 shrink-0">
                  {city.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
