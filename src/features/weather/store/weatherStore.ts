import { create } from "zustand";
import type {
  CitySuggestion,
  CurrentWeather,
  ForecastItem,
} from "../types/weather.types";

interface WeatherState {
  current: CurrentWeather | null;
  forecast: ForecastItem[];
  suggestions: CitySuggestion[];
  selectedCity: CitySuggestion | null;
  isLoading: boolean;
  error: string | null;
  setSuggestions: (s: CitySuggestion[]) => void;
  setSelectedCity: (city: CitySuggestion) => void;
  setCurrent: (w: CurrentWeather) => void;
  setForecast: (f: ForecastItem[]) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  clearSuggestions: () => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  current: null,
  forecast: [],
  suggestions: [],
  selectedCity: null,
  isLoading: false,
  error: null,
  setSuggestions: (suggestions) => set({ suggestions }),
  setSelectedCity: (selectedCity) => set({ selectedCity }),
  setCurrent: (current) => set({ current }),
  setForecast: (forecast) => set({ forecast }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearSuggestions: () => set({ suggestions: [] }),
}));
