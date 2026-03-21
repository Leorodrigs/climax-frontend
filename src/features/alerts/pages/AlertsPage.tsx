import { useCallback, useEffect, useState } from "react";
import { BellOff, Loader2, Plus } from "lucide-react";
import type { Alert } from "../types/alert.types";
import { alertsService } from "../services/alerts.service";
import AlertCard from "../components/AlertCard";
import CreateAlertModal from "../components/CreateAlertModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useToast } from "@/hooks/useToast";
import { useNotifications } from "@/hooks/useNotifications";
import Toast from "@/components/ui/Toast";
import EmptyState from "@/components/ui/EmptyState";
import GradientButton from "@/components/ui/GradientButton";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();
  const { requestPermission } = useNotifications();

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await alertsService.getAll();
      setAlerts(res.data);
    } catch {
      toast.show("Não foi possível carregar os alertas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  async function handleToggle(id: string) {
    try {
      await alertsService.toggle(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)),
      );
    } catch {
      toast.show("Não foi possível atualizar o alerta.");
    }
  }

  async function handleConfirmDelete() {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await alertsService.remove(deletingId);
      setAlerts((prev) => prev.filter((a) => a.id !== deletingId));
      toast.show("Alerta removido.", "success");
    } catch {
      toast.show("Não foi possível remover o alerta.");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  }

  async function handleSuccess() {
    setIsModalOpen(false);
    toast.show("Alerta criado com sucesso!", "success");
    fetchAlerts();

    if (Notification.permission !== "denied") {
      await requestPermission();
    }
  }

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
                onClick={() => setIsModalOpen(true)}
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
                onClick={() => setIsModalOpen(true)}
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
                onDelete={(id) => setDeletingId(id)}
              />
            ))}
          </>
        )}
      </div>

      <CreateAlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
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
