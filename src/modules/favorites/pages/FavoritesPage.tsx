import { Loader2, Star, Search } from "lucide-react";
import { Link } from "react-router-dom";
import FavoriteCard from "../components/FavoriteCard";
import { useFavorites } from "../hooks/useFavorites";
import { APP_ROUTES } from "@/core/constants/app-routes";
import Toast from "@/shared/components/ui/Toast";
import EmptyState from "@/shared/components/ui/EmptyState";

export default function FavoritesPage() {
  const {
    favorites,
    weatherMap,
    loadingMap,
    isLoading,
    toast,
    handleRemove,
    handleSelectFavorite,
  } = useFavorites();

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="text-cyan-400 animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={<Star size={36} className="text-amber-400/85" />}
            iconContainerClassName="border-amber-400 bg-yellow-100/40"
            title="Nenhuma cidade favorita"
            description="Você ainda não salvou nenhuma cidade. Pesquise por uma cidade na barra de busca e adicione-a aos favoritos."
            action={
              <Link
                to={APP_ROUTES.home}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 transition-colors"
              >
                <Search size={15} className="text-white/30 shrink-0" />
                <span>
                  Use a barra de busca no topo para encontrar cidades.
                </span>
              </Link>
            }
          />
        ) : (
          <>
            <p className="text-white/50 text-sm">
              {favorites.length}{" "}
              {favorites.length === 1 ? "cidade favorita" : "cidades favoritas"}
            </p>
            {favorites.map((favorite) => (
              <FavoriteCard
                key={favorite.id}
                favorite={favorite}
                weather={weatherMap[favorite.id]}
                isLoadingWeather={loadingMap[favorite.id]}
                onRemove={handleRemove}
                onSelect={() => handleSelectFavorite(favorite)}
              />
            ))}
          </>
        )}
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={toast.hide}
        type={toast.type}
      />
    </div>
  );
}
