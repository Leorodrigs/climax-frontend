import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/core/constants/app-routes";
import { GLOBAL_MESSAGES } from "@/core/constants/messages";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { weatherService } from "../services/weather.service";
import { useWeatherStore } from "../store/weatherStore";
import type { CitySuggestion } from "../types/weather.types";

export function useWeatherSearch() {
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
      .then((response) => setSuggestions(response.data))
      .catch(() => clearSuggestions())
      .finally(() => setIsFetching(false));
  }, [clearSuggestions, debouncedQuery, setSuggestions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        clearSuggestions();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSuggestions]);

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

    if (location.pathname !== APP_ROUTES.home) {
      navigate(APP_ROUTES.home);
    }

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        weatherService.getCurrent(city.lat, city.lon),
        weatherService.getForecast(city.lat, city.lon),
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
    containerRef,
    query,
    suggestions,
    isFetching,
    handleInputChange,
    handleSelectCity,
  };
}
