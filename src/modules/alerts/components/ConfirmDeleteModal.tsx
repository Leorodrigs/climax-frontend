import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "@/shared/components/ui/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Excluir alerta"
      subtitle="Essa ação não pode ser desfeita."
      icon={<AlertTriangle size={20} className="text-red-400" />}
      iconClassName="bg-red-500/15 border-red-500/20"
    >
      <p className="text-white/60 text-sm mb-6">
        Tem certeza que deseja excluir este alerta? Ele deixará de monitorar as
        condições climáticas configuradas.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold disabled:opacity-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 bg-red-600/15 text-red-500/80 hover:bg-red-600/25 hover:text-red-400 font-semibold text-sm transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          {isDeleting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Sim, excluir"
          )}
        </button>
      </div>
    </Modal>
  );
}
