export interface CitySuggestion {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CurrentWeather {
  cityName: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pop: number;
}
