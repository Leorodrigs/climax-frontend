import { BellOff, Loader2, Plus } from "lucide-react";
import AlertCard from "../components/AlertCard";
import CreateAlertModal from "../components/CreateAlertModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAlerts } from "../hooks/useAlerts";
import Toast from "@/shared/components/ui/Toast";
import EmptyState from "@/shared/components/ui/EmptyState";
import GradientButton from "@/shared/components/ui/GradientButton";

export default function AlertsPage() {
  const {
    alerts,
    isLoading,
    isModalOpen,
    deletingId,
    isDeleting,
    toast,
    openCreateModal,
    closeCreateModal,
    requestDelete,
    closeDeleteModal,
    handleToggle,
    handleConfirmDelete,
    handleSuccess,
  } = useAlerts();

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="text-cyan-400 animate-spin" />
          </div>
        ) : alerts.length === 0 ? (
          <EmptyState
            icon={<BellOff size={36} className="text-white/30" />}
            title="Nenhum alerta criado"
            description="Você ainda não tem alertas configurados. Crie um alerta para ser notificado sobre condições climáticas específicas."
            action={
              <GradientButton
                type="button"
                onClick={openCreateModal}
                className="w-auto px-6"
              >
                <Plus size={18} /> Criar alerta
              </GradientButton>
            }
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-white/50 text-sm">
                {alerts.length}{" "}
                {alerts.length === 1
                  ? "alerta configurado"
                  : "alertas configurados"}
              </p>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Plus size={15} /> Novo alerta
              </button>
            </div>

            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onToggle={handleToggle}
                onDelete={requestDelete}
              />
            ))}
          </>
        )}
      </div>

      <CreateAlertModal
        isOpen={isModalOpen}
        onClose={closeCreateModal}
        onSuccess={handleSuccess}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingId}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={toast.hide}
        type={toast.type}
      />
    </div>
  );
}
