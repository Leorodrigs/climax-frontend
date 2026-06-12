export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    resetPassword: "/auth/reset-password",
  },
  weather: {
    search: "/weather/search",
    current: "/weather/current",
    forecast: "/weather/forecast",
  },
  favorites: {
    base: "/favorites",
    byId: (id: string) => `/favorites/${id}`,
  },
  alerts: {
    base: "/alerts",
    toggle: (id: string) => `/alerts/${id}/toggle`,
    byId: (id: string) => `/alerts/${id}`,
  },
  notifications: {
    token: "/notifications/token",
  },
} as const;
