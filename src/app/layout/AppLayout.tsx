import { Outlet } from "react-router-dom";
import { Background } from "./Background";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Background>
        <Navbar />
        <main className="flex-1 relative z-10">
          <Outlet />
        </main>
      </Background>
    </div>
  );
}
