import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../../shared/ui/select"; 
import { useLibraryStore } from "../../../shared/lib/store/use-library-store";
import type { BookStatus } from "../../../shared/lib/store/use-library-store";
import { useToast } from "../../../shared/hooks/use-toast";

const statusMap = {
  WANT_TO_READ: { label: "Quero Ler", color: "bg-slate-200 text-slate-700" },
  READING: { label: "Lendo", color: "bg-[#FCA72C] text-white" },
  COMPLETED: { label: "Concluído", color: "bg-emerald-500 text-white" },
};

export function StatusBadge({ bookId, currentStatus }: { bookId: string, currentStatus: BookStatus }) {
  const { updateBookStatus } = useLibraryStore();
  const { toast } = useToast();

  const handleStatusChange = (value: string) => {
    const newStatus = value as BookStatus;
    
    updateBookStatus(bookId, newStatus);
    
    toast({
      title: "Progresso atualizado!",
      description: `O status foi alterado para: ${statusMap[newStatus].label}`,
      className: "border-[#FCA72C]/20 bg-white shadow-lg font-medium",
    });
  };

  return (
    <Select 
      defaultValue={currentStatus} 
      onValueChange={handleStatusChange}
    >
      <SelectTrigger 
        className={`h-8 w-fit gap-2 border-none text-[10px] font-black uppercase tracking-wider rounded-full px-4 transition-all active:scale-95 ${statusMap[currentStatus]?.color || statusMap.WANT_TO_READ.color}`}
      >
        <SelectValue />
      </SelectTrigger>
      
      <SelectContent 
        position="popper" 
        sideOffset={5}
        className="z-[200] min-w-[140px] bg-white rounded-xl border-[#F2E5D0] shadow-xl p-1"
      >
        <SelectItem value="WANT_TO_READ" className="text-[11px] font-bold rounded-lg focus:bg-slate-100">
          Quero Ler
        </SelectItem>
        <SelectItem value="READING" className="text-[11px] font-bold rounded-lg focus:bg-[#FCA72C]/10 focus:text-[#FCA72C]">
          Lendo
        </SelectItem>
        <SelectItem value="COMPLETED" className="text-[11px] font-bold rounded-lg focus:bg-emerald-50 focus:text-emerald-600">
          Concluído
        </SelectItem>
      </SelectContent>
    </Select>
  );
}