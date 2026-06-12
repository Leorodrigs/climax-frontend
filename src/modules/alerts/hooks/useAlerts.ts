import { useCallback, useEffect, useState } from "react";
import { useNotifications } from "@/modules/notifications/hooks/useNotifications";
import { useToast } from "@/shared/hooks/useToast";
import { alertsService } from "../services/alerts.service";
import type { Alert } from "../types/alert.types";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();
  const showToast = toast.show;
  const { requestPermission } = useNotifications();

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await alertsService.getAll();
      setAlerts(response.data);
    } catch {
      showToast("Não foi possível carregar os alertas.");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void fetchAlerts();
  }, [fetchAlerts]);

  async function handleToggle(id: string) {
    try {
      await alertsService.toggle(id);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, isActive: !alert.isActive } : alert,
        ),
      );
    } catch {
      showToast("Não foi possível atualizar o alerta.");
    }
  }

  async function handleConfirmDelete() {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      await alertsService.remove(deletingId);
      setAlerts((prev) => prev.filter((alert) => alert.id !== deletingId));
      showToast("Alerta removido.", "success");
    } catch {
      showToast("Não foi possível remover o alerta.");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  }

  async function handleSuccess() {
    setIsModalOpen(false);
    showToast("Alerta criado com sucesso!", "success");
    void fetchAlerts();

    if (Notification.permission !== "denied") {
      await requestPermission();
    }
  }

  return {
    alerts,
    isLoading,
    isModalOpen,
    deletingId,
    isDeleting,
    toast,
    openCreateModal: () => setIsModalOpen(true),
    closeCreateModal: () => setIsModalOpen(false),
    requestDelete: setDeletingId,
    closeDeleteModal: () => setDeletingId(null),
    handleToggle,
    handleConfirmDelete,
    handleSuccess,
  };
}
