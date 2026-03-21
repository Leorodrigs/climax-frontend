import { useRef } from "react";
import { useWeatherStore } from "../store/weatherStore";
import type { ForecastItem } from "../types/weather.types";
import SectionTitle from "@/components/ui/SectionTitle";

interface DayForecast {
  dateLabel: string;
  dateStr: string;
  icon: string;
  pop: number;
  tempMin: number;
  tempMax: number;
}

const DAY_NAMES = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

function groupByDay(items: ForecastItem[]): DayForecast[] {
  const days = new Map<string, ForecastItem[]>();

  items.forEach((item) => {
    const key = new Date(item.dt * 1000).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    if (!days.has(key)) days.set(key, []);
    days.get(key)!.push(item);
  });

  return Array.from(days.entries())
    .slice(0, 5)
    .map(([dateStr, dayItems], index) => {
      const date = new Date(dayItems[0].dt * 1000);
      const dayLabel = index === 0 ? "HOJE" : DAY_NAMES[date.getDay()];

      const middayItem =
        dayItems.find((i) => {
          const h = new Date(i.dt * 1000).getHours();
          return h >= 11 && h <= 14;
        }) ?? dayItems[Math.floor(dayItems.length / 2)];

      return {
        dateLabel: dayLabel,
        dateStr,
        icon: middayItem.icon,
        pop: Math.round(Math.max(...dayItems.map((i) => i.pop ?? 0)) * 100),
        tempMin: Math.round(Math.min(...dayItems.map((i) => i.tempMin))),
        tempMax: Math.round(Math.max(...dayItems.map((i) => i.tempMax))),
      };
    });
}

function TempBar({
  min,
  max,
  globalMin,
  globalMax,
}: {
  min: number;
  max: number;
  globalMin: number;
  globalMax: number;
}) {
  const range = globalMax - globalMin || 1;
  const left = ((min - globalMin) / range) * 100;
  const width = ((max - min) / range) * 100;

  return (
    <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
      <div
        className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
        style={{ left: `${left}%`, width: `${width}%` }}
      />
    </div>
  );
}

function DayCard({
  day,
  isToday,
  globalMin,
  globalMax,
}: {
  day: DayForecast;
  isToday: boolean;
  globalMin: number;
  globalMax: number;
}) {
  return (
    <div
      className={`flex-shrink-0 w-24 sm:w-auto flex flex-col items-center gap-3 rounded-2xl p-3 border transition-colors
        ${isToday ? "bg-sky-900/80 border-cyan-500/30" : "bg-mist-50/10 border-white/5"}`}
    >
      <span
        className={`text-xs font-bold tracking-wider ${isToday ? "text-cyan-400" : "text-white/70"}`}
      >
        {day.dateLabel}
      </span>
      <span className="text-white/30 text-xs">{day.dateStr}</span>

      <img
        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
        alt=""
        className="w-12 h-12 bg-white/40 rounded-xl"
      />

      <span className="text-cyan-400 text-sm font-semibold">{day.pop}%</span>

      <TempBar
        min={day.tempMin}
        max={day.tempMax}
        globalMin={globalMin}
        globalMax={globalMax}
      />

      <div className="flex flex-col items-center gap-1 text-xs">
        <span className="text-red-400 font-medium">↑ {day.tempMax}°</span>
        <span className="text-blue-400 font-medium">↓ {day.tempMin}°</span>
      </div>
    </div>
  );
}

export default function ForecastCard() {
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
        <div className="h-4 bg-white/10 rounded w-36 mb-5" />
        <div className="flex gap-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white/10 rounded-2xl h-44 w-24 shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!forecast.length) return null;

  const days = groupByDay(forecast);
  const globalMin = Math.min(...days.map((d) => d.tempMin));
  const globalMax = Math.max(...days.map((d) => d.tempMax));

  return (
    <div className="w-full max-w-2xl bg-gray-700/20 backdrop-blur-md rounded-3xl p-6 my-5 border border-white/10">
      <div className="flex items-center justify-between mb-5">
        <SectionTitle>Previsão 5 dias</SectionTitle>
      </div>

      <div
        ref={scrollRef}
        className="flex sm:hidden gap-3 overflow-x-auto scrollbar-none cursor-grab select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {days.map((day, index) => (
          <DayCard
            key={day.dateStr}
            day={day}
            isToday={index === 0}
            globalMin={globalMin}
            globalMax={globalMax}
          />
        ))}
      </div>

      <div className="hidden sm:grid grid-cols-5 gap-3">
        {days.map((day, index) => (
          <DayCard
            key={day.dateStr}
            day={day}
            isToday={index === 0}
            globalMin={globalMin}
            globalMax={globalMax}
          />
        ))}
      </div>
    </div>
  );
}
