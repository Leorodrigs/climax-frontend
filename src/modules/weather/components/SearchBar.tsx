import { Search, Loader2 } from "lucide-react";
import { useWeatherSearch } from "../hooks/useWeatherSearch";

export default function SearchBar() {
  const {
    containerRef,
    query,
    suggestions,
    isFetching,
    handleInputChange,
    handleSelectCity,
  } = useWeatherSearch();

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
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder="Pesquise por uma cidade"
          className="flex-1 min-w-0 outline-none text-slate-800 placeholder-slate-400 bg-transparent text-sm truncate"
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">
          {suggestions.map((city, index) => (
            <li key={index}>
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
