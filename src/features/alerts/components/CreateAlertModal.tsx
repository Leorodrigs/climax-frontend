import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Loader2, MapPin } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { weatherService } from "@/features/weather/services/weather.service";
import type { CitySuggestion } from "@/features/weather/types/weather.types";
import { alertsService } from "../services/alerts.service";
import type { AlertType, CreateAlertPayload } from "../types/alert.types";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import GlassInput from "@/components/ui/GlassInput";
import GradientButton from "@/components/ui/GradientButton";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ALERT_OPTIONS: { value: AlertType; label: string }[] = [
  { value: "TEMPERATURE_BELOW", label: "Temperatura abaixo de..." },
  { value: "TEMPERATURE_ABOVE", label: "Temperatura acima de..." },
  { value: "STORM", label: "Tempestade" },
  { value: "RAIN", label: "Chuva" },
];

const NEEDS_THRESHOLD: AlertType[] = ["TEMPERATURE_BELOW", "TEMPERATURE_ABOVE"];

export default function CreateAlertModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [alertType, setAlertType] = useState<AlertType | "">("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const [cityQuery, setCityQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<CitySuggestion | null>(null);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [thresholdValue, setThresholdValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const typeRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(cityQuery, 400);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    if (selectedCity) return;

    setIsSearching(true);
    weatherService
      .search(debouncedQuery)
      .then((res: { data: CitySuggestion[] }) => {
        setSuggestions(res.data);
        setShowSuggestions(true);
      })
      .catch(() => setSuggestions([]))
      .finally(() => setIsSearching(false));
  }, [debouncedQuery]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(e.target as Node))
        setShowTypeDropdown(false);
      if (cityRef.current && !cityRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setAlertType("");
      setCityQuery("");
      setSelectedCity(null);
      setSuggestions([]);
      setThresholdValue("");
      setError("");
    }
  }, [isOpen]);

  function handleCityChange(value: string) {
    setCityQuery(value);
    setSelectedCity(null);
  }

  function handleSelectCity(city: CitySuggestion) {
    setSelectedCity(city);
    setCityQuery(`${city.name}, ${city.country}`);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!alertType) return setError("Selecione um tipo de alerta.");
    if (!selectedCity) return setError("Selecione uma cidade válida.");
    if (
      NEEDS_THRESHOLD.includes(alertType as AlertType) &&
      (thresholdValue === "" || isNaN(Number(thresholdValue)))
    )
      return setError("Informe um valor de temperatura válido.");

    const payload: CreateAlertPayload = {
      cityName: selectedCity.name,
      lat: selectedCity.lat,
      lon: selectedCity.lon,
      alertType: alertType as AlertType,
      ...(NEEDS_THRESHOLD.includes(alertType as AlertType) && {
        thresholdValue: Number(thresholdValue),
      }),
    };

    setIsSubmitting(true);
    try {
      await alertsService.create(payload);
      onSuccess();
    } catch {
      setError("Não foi possível criar o alerta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const needsThreshold = NEEDS_THRESHOLD.includes(alertType as AlertType);
  const selectedLabel = ALERT_OPTIONS.find((o) => o.value === alertType)?.label;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Criar novo alerta"
      subtitle="Escolha a condição e a cidade a monitorar."
      icon={<Bell size={20} className="text-cyan-400" />}
      iconClassName="bg-cyan-500/20 border-cyan-500/30"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Tipo de alerta">
          <div ref={typeRef} className="relative">
            <button
              type="button"
              onClick={() => setShowTypeDropdown((p) => !p)}
              className="w-full flex items-center justify-between gap-3 bg-mist-50/10 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/30 transition-colors"
            >
              <span
                className={`text-sm ${alertType ? "text-white" : "text-white/30"}`}
              >
                {selectedLabel ?? "Selecione uma condição..."}
              </span>
              <ChevronDown
                size={16}
                className={`text-white/30 shrink-0 transition-transform duration-200 ${showTypeDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showTypeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 z-10 bg-gray-800 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                {ALERT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setAlertType(option.value);
                      setShowTypeDropdown(false);
                      setThresholdValue("");
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                      ${
                        alertType === option.value
                          ? "text-cyan-400 bg-cyan-500/10"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormField>

        {needsThreshold && (
          <FormField label="Temperatura limite (°C)">
            <GlassInput
              trailing={<span className="text-white/30 text-sm">°C</span>}
            >
              <input
                type="number"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(e.target.value)}
                placeholder="Ex: 15"
                className="flex-1 bg-transparent outline-none text-white placeholder-white/20 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </GlassInput>
          </FormField>
        )}

        <FormField label="Cidade">
          <div ref={cityRef} className="relative">
            <GlassInput
              icon={
                isSearching ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <MapPin size={16} />
                )
              }
            >
              <input
                type="text"
                value={cityQuery}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="Selecione uma cidade..."
                className="flex-1 bg-transparent outline-none text-white placeholder-white/20 text-sm"
              />
            </GlassInput>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-10 bg-gray-800 border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-48 overflow-y-auto">
                {suggestions.map((city, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <MapPin size={13} className="text-cyan-500/60 shrink-0" />
                    {city.name}
                    {city.state ? `, ${city.state}` : ""}, {city.country}
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormField>

        {error && <p className="text-red-500/70 text-sm -mt-1">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <GradientButton isLoading={isSubmitting} className="flex-1">
            <Bell size={15} /> Criar alerta
          </GradientButton>
        </div>
      </form>
    </Modal>
  );
}
