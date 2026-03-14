import { useLibraryStore } from "../../../shared/lib/store/use-library-store";
import type { BookStatus } from "../../../shared/lib/store/use-library-store";
import { useToast } from "../../../shared/hooks/use-toast";

const statusMap = {
  WANT_TO_READ: { label: "Quero Ler", color: "bg-base-300 text-base-content" },
  READING: { label: "Lendo", color: "bg-warning text-warning-content" },
  COMPLETED: { label: "Concluído", color: "bg-success text-success-content" },
};

export function StatusBadge({ bookId, currentStatus }: { bookId: string, currentStatus: BookStatus }) {
  const { updateBookStatus } = useLibraryStore();
  const { toast } = useToast();

  const handleStatusChange = (newStatus: BookStatus) => {
    updateBookStatus(bookId, newStatus);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    toast({
      title: "Progresso atualizado!",
      description: `O status foi alterado para: ${statusMap[newStatus].label}`,
    });
  };

  return (
    <div className="dropdown dropdown-end">
      <div 
        tabIndex={0} 
        role="button" 
        className={`h-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider rounded-full px-4 transition-all active:scale-95 cursor-pointer shadow-sm ${statusMap[currentStatus]?.color}`}
      >
        {statusMap[currentStatus]?.label}
      </div>

      <ul 
        tabIndex={0} 
        className="dropdown-content z-[200] menu p-2 shadow-2xl bg-base-100 rounded-box w-40 mt-2 border border-base-200"
      >
        <li>
          <button 
            onClick={() => handleStatusChange("WANT_TO_READ")}
            className="text-[11px] font-bold hover:bg-base-200"
          >
            Quero Ler
          </button>
        </li>
        <li>
          <button 
            onClick={() => handleStatusChange("READING")}
            className="text-[11px] font-bold text-warning hover:bg-warning/10"
          >
            Lendo
          </button>
        </li>
        <li>
          <button 
            onClick={() => handleStatusChange("COMPLETED")}
            className="text-[11px] font-bold text-success hover:bg-success/10"
          >
            Concluído
          </button>
        </li>
      </ul>
    </div>
  );
}