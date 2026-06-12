export interface Favorite {
  id: string;
  cityName: string;
  lat: number;
  lon: number;
  country: string;
  createdAt: string;
}

export interface CreateFavoritePayload {
  cityName: string;
  lat: number;
  lon: number;
  country: string;
}
