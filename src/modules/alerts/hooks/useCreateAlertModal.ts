import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { weatherService } from "@/modules/weather/services/weather.service";
import type { CitySuggestion } from "@/modules/weather/types/weather.types";
import { NEEDS_THRESHOLD } from "../constants/alert-options";
import { alertsService } from "../services/alerts.service";
import type { AlertType, CreateAlertPayload } from "../types/alert.types";

interface UseCreateAlertModalParams {
  isOpen: boolean;
  onSuccess: () => void;
}

export function useCreateAlertModal({
  isOpen,
  onSuccess,
}: UseCreateAlertModalParams) {
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
      .then((response) => {
        setSuggestions(response.data);
        setShowSuggestions(true);
      })
      .catch(() => {
        setSuggestions([]);
        setShowSuggestions(false);
      })
      .finally(() => setIsSearching(false));
  }, [debouncedQuery, selectedCity]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setAlertType("");
      setShowTypeDropdown(false);
      setCityQuery("");
      setSelectedCity(null);
      setSuggestions([]);
      setShowSuggestions(false);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!alertType) {
      setError("Selecione um tipo de alerta.");
      return;
    }
    if (!selectedCity) {
      setError("Selecione uma cidade válida.");
      return;
    }
    if (
      NEEDS_THRESHOLD.includes(alertType) &&
      (thresholdValue === "" || Number.isNaN(Number(thresholdValue)))
    ) {
      setError("Informe um valor de temperatura válido.");
      return;
    }

    const payload: CreateAlertPayload = {
      cityName: selectedCity.name,
      lat: selectedCity.lat,
      lon: selectedCity.lon,
      alertType,
      ...(NEEDS_THRESHOLD.includes(alertType) && {
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

  return {
    alertType,
    showTypeDropdown,
    cityQuery,
    selectedCity,
    suggestions,
    showSuggestions,
    isSearching,
    thresholdValue,
    isSubmitting,
    error,
    typeRef,
    cityRef,
    needsThreshold: alertType ? NEEDS_THRESHOLD.includes(alertType) : false,
    setAlertType,
    setShowTypeDropdown,
    setThresholdValue,
    handleCityChange,
    handleSelectCity,
    handleSubmit,
  };
}
