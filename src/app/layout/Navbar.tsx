import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Cloud, X } from "lucide-react";
import DrawerMenu from "./DrawerMenu";
import SearchBar from "@/modules/weather/components/SearchBar";
import { APP_ROUTES } from "@/core/constants/app-routes";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-gradient-to-r from-cyan-100 to-cyan-600 shadow-xl flex items-center gap-2 px-3 sm:px-4">
        <Link to={APP_ROUTES.home} className="shrink-0">
          <img src={logo} alt="ClimaX" className="h-16 w-auto drop-shadow-md" />
        </Link>

        <div className="flex-1 sm:flex-none sm:w-96 min-w-0">
          <SearchBar />
        </div>

        <div className="hidden sm:flex flex-1" />

        <div className="shrink-0">
          {isOpen ? (
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu"
              className="p-2 bg-mist-50/60 border border-mist-100 rounded-xl shadow-md text-slate-800 transition-all duration-300 hover:bg-slate-50 cursor-pointer"
            >
              <X size={24} />
            </button>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Abrir menu"
              className="group p-2 bg-mist-50/60 border border-mist-100 rounded-xl shadow-md text-slate-800 transition-all duration-300 hover:bg-slate-50 cursor-pointer"
            >
              <div className="relative w-6 h-6">
                <Menu
                  size={24}
                  className="absolute transition-all duration-300 group-hover:opacity-0 group-hover:scale-50 group-hover:rotate-90"
                />
                <Cloud
                  size={24}
                  className="absolute opacity-0 scale-50 -rotate-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0"
                />
              </div>
            </button>
          )}
        </div>
      </header>

      <div className="h-16" />

      <DrawerMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
