import { api } from "@/lib/axios";
import type {
  CitySuggestion,
  CurrentWeather,
  ForecastItem,
} from "../types/weather.types";

export const weatherService = {
  search: (q: string) =>
    api.get<CitySuggestion[]>("/weather/search", { params: { q } }),

  getCurrent: (lat: number, lon: number) =>
    api.get<CurrentWeather>("/weather/current", { params: { lat, lon } }),

  getForecast: (lat: number, lon: number) =>
    api.get<ForecastItem[]>("/weather/forecast", { params: { lat, lon } }),
};
