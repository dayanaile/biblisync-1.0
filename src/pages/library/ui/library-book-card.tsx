import type { Book } from "../../../entities/book/model/types";
import { useState } from "react";
import { Button } from "../../../shared/ui/button";
import { useLibraryStore } from "../../../shared/lib/store/use-library-store";
import { useFavoritesStore } from "../../../shared/lib/store/use-favorites-store";
import { Trash2, Star, Book as BookIcon, BookOpen } from "lucide-react";
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
            toast({
                title: "Removido dos favoritos",
                description: `${book.title} saiu da sua lista de destaques.`,
            });
        } else {
            addFavorite(book);
            toast({
                title: "Favoritado!",
                description: `${book.title} agora é um dos seus favoritos.`,
            });
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeBook(book.id);
        toast({
            title: "Livro removido",
            description: "O item foi retirado da sua biblioteca com sucesso.",
            className: "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white",
        });
    };

    return (
        <>
            <div className="absolute top-0 left-6 z-20">
                <div className={`p-2 pb-3 rounded-b-md shadow-lg flex flex-col items-center transition-colors ${
                    book.status === 'READING' ? 'bg-[#FCA72C]' : 'bg-[#725B3A]'
                }`}>
                    <span className="text-[8px] font-black text-white uppercase vertical-text">
                        {book.status === 'COMPLETED' ? 'Lido' : 'Status'}
                    </span>
                </div>
            </div>
            <div className="group cursor-pointer flex flex-col space-y-4 isolate">
                <div 
                    className="relative aspect-[2/3] w-full overflow-hidden rounded-[32px] shadow-xl"
                    onClick={() => setIsPreviewOpen(true)}
                >
                    <div className="absolute top-0 right-16 z-20">
                        <div className={`text-white p-2 pb-3 rounded-b-md shadow-lg flex flex-col items-center gap-1 transition-colors duration-300 ${
                            book.printType === 'magazines' ? 'bg-pink-500' : 'bg-blue-600'
                        }`}>
                            {book.printType === 'magazines' ? <BookOpen size={16} /> : <BookIcon size={16} />}
                        </div>
                    </div>

                    {isFav && (
                        <div className="absolute top-0 right-6 z-20 animate-in slide-in-from-top-2 duration-300">
                            <div className="bg-amber-500 text-white p-2 pb-3 rounded-b-md shadow-lg flex flex-col items-center">
                                <Star size={18} fill="currentColor" />
                            </div>
                        </div>
                    )}

                    <img 
                        src={book.coverUrl} 
                        alt={book.title}
                        className="h-full w-full object-cover transition-all duration-500 group-hover:blur-[6px] group-hover:scale-105"
                    />

                    <StatusBadge 
                        bookId={book.id} 
                        currentStatus={book.status || 'WANT_TO_READ'} 
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 space-y-3 z-10">
                        <Button 
                            onClick={handleRemove}
                            size="sm"
                            className="w-full rounded-full bg-red-600 text-white shadow-lg hover:bg-white hover:text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                        </Button>

                        <Button 
                            onClick={handleToggleFavorite}
                            size="sm"
                            variant={isFav ? "default" : "outline"}
                            className={`w-full rounded-full transition-all duration-300 ${
                                isFav ? "bg-amber-500 hover:bg-amber-600 text-white border-none" : "border-white/50 text-white hover:bg-white hover:text-black"
                            }`}
                        >
                            <Star className="mr-2 h-4 w-4" />
                            {isFav ? "Favoritado" : "Favoritar"}
                        </Button>
                    </div>
                </div>

                <div className="px-1" onClick={() => setIsPreviewOpen(true)}>
                    <h3 className="font-bold text-sm text-foreground line-clamp-1 truncate hover:text-secondary transition-colors">
                        {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground italic line-clamp-1">{book.author}</p>
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