import { apiClient } from "@/core/api/api-client";
import type { ApiResponse } from "@/core/@types/http.types";
import { API_ENDPOINTS } from "@/core/constants/api-endpoints";
import type {
  CitySuggestion,
  CurrentWeather,
  ForecastItem,
} from "../types/weather.types";

export const weatherService = {
  search: (q: string): ApiResponse<CitySuggestion[]> =>
    apiClient.get<CitySuggestion[]>(API_ENDPOINTS.weather.search, {
      params: { q },
    }),

  getCurrent: (lat: number, lon: number): ApiResponse<CurrentWeather> =>
    apiClient.get<CurrentWeather>(API_ENDPOINTS.weather.current, {
      params: { lat, lon },
    }),

  getForecast: (lat: number, lon: number): ApiResponse<ForecastItem[]> =>
    apiClient.get<ForecastItem[]>(API_ENDPOINTS.weather.forecast, {
      params: { lat, lon },
    }),
};
