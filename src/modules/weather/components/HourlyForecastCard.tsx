import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWeatherStore } from "../store/weatherStore";
import type { ForecastItem } from "../types/weather.types";
import SectionTitle from "./SectionTitle";

interface HourlySlot {
  timeLabel: string;
  icon: string;
  pop: number;
  temp: number;
  isNow: boolean;
}

function getHourlySlots(items: ForecastItem[]): HourlySlot[] {
  const nowSec = Date.now() / 1000;

  let nowIndex = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].dt >= nowSec - 5400) {
      nowIndex = i;
      break;
    }
  }

  return items.slice(nowIndex, nowIndex + 8).map((item, index) => {
    const date = new Date(item.dt * 1000);
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");

    return {
      timeLabel: index === 0 ? "AGORA" : `${hh}:${mm}`,
      icon: item.icon,
      pop: Math.round((item.pop ?? 0) * 100),
      temp: Math.round(item.temp),
      isNow: index === 0,
    };
  });
}

function VerticalTempBar({
  temp,
  globalMin,
  globalMax,
}: {
  temp: number;
  globalMin: number;
  globalMax: number;
}) {
  const range = globalMax - globalMin || 1;
  const height = Math.max(15, ((temp - globalMin) / range) * 100);

  return (
    <div className="relative w-1 h-14 bg-white/10 rounded-full overflow-hidden flex flex-col justify-end">
      <div
        className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-blue-400 to-orange-400"
        style={{ height: `${height}%` }}
      />
    </div>
  );
}

export default function HourlyForecastCard() {
  const { forecast, isLoading } = useWeatherStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current!.offsetLeft;
    scrollLeft.current = scrollRef.current!.scrollLeft;
    scrollRef.current!.style.cursor = "grabbing";
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    scrollRef.current!.scrollLeft =
      scrollLeft.current - (x - startX.current) * 1.5;
  }
  function onMouseUp() {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }

  function scrollBy(direction: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: direction === "right" ? 110 : -110,
      behavior: "smooth",
    });
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl bg-gray-700/20 backdrop-blur-md rounded-3xl p-6 border border-white/10 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-44 mb-5" />
        <div className="flex gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white/10 rounded-2xl h-52 w-20 shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!forecast.length) return null;

  const slots = getHourlySlots(forecast);
  const globalMin = Math.min(...slots.map((s) => s.temp));
  const globalMax = Math.max(...slots.map((s) => s.temp));

  return (
    <div className="w-full max-w-2xl bg-gray-700/20 backdrop-blur-md rounded-3xl p-6 border border-white/10 mb-5">
      <div className="flex items-center justify-between mb-5">
        <SectionTitle>Previsão 24h</SectionTitle>
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scrollBy("left")}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scrollBy("right")}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-none cursor-grab select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {slots.map((slot) => (
          <div
            key={slot.timeLabel}
            className={`flex-shrink-0 w-24 flex flex-col items-center gap-3 rounded-2xl p-3 border transition-colors
              ${
                slot.isNow
                  ? "bg-sky-900/80 border-cyan-500/30"
                  : "bg-mist-50/10 border-white/5"
              }`}
          >
            <span
              className={`text-xs font-bold tracking-wider ${
                slot.isNow ? "text-cyan-400" : "text-white/70"
              }`}
            >
              {slot.timeLabel}
            </span>

            <img
              src={`https://openweathermap.org/img/wn/${slot.icon}@2x.png`}
              alt=""
              className="w-12 h-12 bg-white/40 rounded-xl"
            />

            <span className="text-cyan-400 text-sm font-semibold">
              {slot.pop}%
            </span>

            <VerticalTempBar
              temp={slot.temp}
              globalMin={globalMin}
              globalMax={globalMax}
            />

            <span className="text-white font-semibold text-sm">
              {slot.temp}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
