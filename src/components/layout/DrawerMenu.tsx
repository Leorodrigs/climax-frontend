import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Star,
  Bell,
  Info,
  LogIn,
  UserPlus,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import GradientButton from "@/components/ui/GradientButton";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ isOpen, onClose }: Props) {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleLogout() {
    logout();
    onClose();
    navigate("/");
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-200
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div
        className={`fixed top-[4.5rem] right-4 z-50 w-64 bg-gradient-to-b from-cyan-100 to-cyan-600
          backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden [transform:translateZ(0)]
          transition-all duration-200 ease-out origin-top-right
          ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
      >
        <nav className="p-2 flex flex-col gap-0.5">
          <NavLink
            to="/favorites"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-colors group"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl border border-amber-400 bg-yellow-100/40 shrink-0">
              <Star size={18} className="text-amber-400" />
            </span>
            <span className="flex-1 text-cyan-900 font-semibold text-sm">
              Favoritos
            </span>
            <ChevronRight size={15} className="text-cyan-900" />
          </NavLink>

          <NavLink
            to="/alerts"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-colors group"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl border border-cyan-600 bg-sky-200/40 shrink-0">
              <Bell size={18} className="text-cyan-600" />
            </span>
            <span className="flex-1 text-cyan-900 font-semibold text-sm">
              Alertas
            </span>
            <ChevronRight size={15} className="text-cyan-900" />
          </NavLink>

          <NavLink
            to="/about"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-colors group"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl border border-purple-600 bg-purple-200/40 shrink-0">
              <Info size={18} className="text-purple-600" />
            </span>
            <span className="flex-1 text-cyan-900 font-semibold text-sm">
              Sobre
            </span>
            <ChevronRight size={15} className="text-cyan-900" />
          </NavLink>
        </nav>

        <div className="mx-4 h-px bg-black/10" />

        <div className="p-3 flex flex-col gap-2">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-red-500/80 to-rose-500/80 hover:shadow-lg hover:shadow-red-500/30 text-white font-semibold text-sm transition-all active:scale-95"
            >
              <LogOut size={16} /> Sair
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm transition-colors"
              >
                <LogIn size={16} /> Entrar
              </NavLink>
              <GradientButton
                type="button"
                onClick={() => {
                  navigate("/register");
                  onClose();
                }}
              >
                <UserPlus size={16} /> Cadastrar
              </GradientButton>
            </>
          )}
        </div>
      </div>
    </>
  );
}
