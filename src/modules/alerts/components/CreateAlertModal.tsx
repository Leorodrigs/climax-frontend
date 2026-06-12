import { Bell, ChevronDown, Loader2, MapPin } from "lucide-react";
import { ALERT_OPTIONS } from "../constants/alert-options";
import { useCreateAlertModal } from "../hooks/useCreateAlertModal";
import Modal from "@/shared/components/ui/Modal";
import FormField from "@/shared/components/ui/FormField";
import GlassInput from "@/shared/components/ui/GlassInput";
import GradientButton from "@/shared/components/ui/GradientButton";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAlertModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const {
    alertType,
    showTypeDropdown,
    cityQuery,
    suggestions,
    showSuggestions,
    isSearching,
    thresholdValue,
    isSubmitting,
    error,
    typeRef,
    cityRef,
    needsThreshold,
    setAlertType,
    setShowTypeDropdown,
    setThresholdValue,
    handleCityChange,
    handleSelectCity,
    handleSubmit,
  } = useCreateAlertModal({ isOpen, onSuccess });

  const selectedLabel = ALERT_OPTIONS.find(
    (option) => option.value === alertType,
  )?.label;

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
              onClick={() => setShowTypeDropdown((prev) => !prev)}
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
                onChange={(event) => setThresholdValue(event.target.value)}
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
                onChange={(event) => handleCityChange(event.target.value)}
                placeholder="Selecione uma cidade..."
                className="flex-1 bg-transparent outline-none text-white placeholder-white/20 text-sm"
              />
            </GlassInput>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-10 bg-gray-800 border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-48 overflow-y-auto">
                {suggestions.map((city, index) => (
                  <button
                    key={index}
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
