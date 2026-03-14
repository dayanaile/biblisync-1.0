import type { Book } from "../../../entities/book/model/types";
import { useState } from "react";
import { useLibraryStore } from "../../../shared/lib/store/use-library-store";
import { useFavoritesStore } from "../../../shared/lib/store/use-favorites-store";
import { Trash2, Star, Book as BookIcon, BookOpen, Eye } from "lucide-react";
import { BookPreviewModal } from "../../../entities/book/ui/book-preview-modal";
import { StatusBadge } from "../../../entities/book/ui/status-badge";
import { useToast } from "../../../shared/hooks/use-toast";

export function LibraryBookCard({ book }: { book: Book }) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { removeBook } = useLibraryStore();
    const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
    const { toast } = useToast();
    const isFav = isFavorite(book.id);

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFav) {
            removeFavorite(book.id);
            toast({ title: "Removido", description: `${book.title} saiu dos favoritos.` });
        } else {
            addFavorite(book);
            toast({ title: "Favoritado!", description: `${book.title} agora é destaque.` });
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeBook(book.id);
        toast({
            title: "Livro removido",
            description: "O item foi retirado da sua biblioteca.",
        });
    };

    return (
        <>
            <div className="group relative flex flex-col space-y-4 isolate">
                
                {/* BADGES SUPERIORES (ESTILO BOOKMARK) */}
                <div className="absolute top-0 left-4 z-20 flex gap-1">
                    {/* Status Bookmark */}
                    <div className={`badge badge-ghost h-auto py-2 rounded-t-none rounded-b-lg shadow-md border-none flex-col gap-1 transition-colors ${
                        book.status === 'READING' ? 'bg-warning text-warning-content' : 'bg-neutral text-neutral-content'
                    }`}>
                        <span className="text-[7px] font-black uppercase [writing-mode:vertical-lr] rotate-180">
                            {book.status === 'COMPLETED' ? 'Lido' : 'Status'}
                        </span>
                    </div>

                    {/* Print Type Bookmark */}
                    <div className={`badge h-auto py-2 rounded-t-none rounded-b-lg shadow-md border-none text-white ${
                        book.printType === 'magazines' ? 'bg-secondary' : 'bg-info'
                    }`}>
                        {book.printType === 'magazines' ? <BookOpen size={14} /> : <BookIcon size={14} />}
                    </div>
                </div>

                {/* Favorite Star Bookmark */}
                {isFav && (
                    <div className="absolute top-0 right-4 z-20 animate-in slide-in-from-top-2">
                        <div className="badge badge-warning h-auto py-2 rounded-t-none rounded-b-lg shadow-md border-none text-white">
                            <Star size={16} fill="currentColor" />
                        </div>
                    </div>
                )}

                {/* COVER IMAGE CONTAINER */}
                <div 
                    className="relative aspect-[2/3] w-full overflow-hidden rounded-[32px] shadow-xl bg-base-200"
                    onClick={() => setIsPreviewOpen(true)}
                >
                    <img 
                        src={book.coverUrl} 
                        alt={book.title}
                        className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-[4px]"
                    />

                    {/* OVERLAY DE AÇÕES */}
                    <div className="absolute inset-0 bg-neutral/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 gap-3 z-10">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(true); }}
                            className="btn btn-sm btn-circle btn-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-16 scale-0 group-hover:scale-100 transition-transform duration-300"
                        >
                            <Eye size={18} />
                        </button>

                        <button 
                            onClick={handleToggleFavorite}
                            className={`btn btn-sm w-full rounded-full border-none transition-all ${
                                isFav ? "btn-warning text-white" : "btn-ghost bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-neutral"
                            }`}
                        >
                            <Star size={14} fill={isFav ? "currentColor" : "none"} />
                            {isFav ? "Favoritado" : "Favoritar"}
                        </button>

                        <button 
                            onClick={handleRemove}
                            className="btn btn-sm btn-error btn-outline w-full rounded-full bg-transparent hover:text-white"
                        >
                            <Trash2 size={14} />
                            Remover
                        </button>
                    </div>

                    {/* REUSANDO SEU STATUS BADGE JÁ ATUALIZADO */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[80%]">
                        <StatusBadge 
                            bookId={book.id} 
                            currentStatus={book.status || 'WANT_TO_READ'} 
                        />
                    </div>
                </div>

                {/* INFO TEXT */}
                <div className="px-1 cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
                    <h3 className="font-bold text-sm text-base-content line-clamp-1 truncate group-hover:text-primary transition-colors">
                        {book.title}
                    </h3>
                    <p className="text-[11px] opacity-60 italic line-clamp-1">{book.author}</p>
                </div>
            </div>

            <BookPreviewModal
                book={book}
                isOpen={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
            />
        </>
    );
}