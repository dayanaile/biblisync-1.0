import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { bookService } from "../../../entities/book/api/book.service";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { useLibraryStore } from "../../../shared/lib/store/use-library-store";
import { StatusBadge } from "../../../entities/book/ui/status-badge";
import { useToast } from "../../../shared/hooks/use-toast";

interface Props {
    book: any;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BookPreviewModal({ book, isOpen, onOpenChange }: Props) {
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const { addBook, removeBook, isInLibrary, books } = useLibraryStore();
    const isSaved = isInLibrary(book.id);
    
    const libraryBook = books.find(b => b.id === book.id);

    const { data: fullBook, isLoading } = useQuery({
        queryKey: ['book', book.id],
        queryFn: () => bookService.getById(book.id),
        enabled: isOpen,
        staleTime: 1000 * 60 * 5,
    });

    const handleMoreDetails = () => {
        onOpenChange(false);
        navigate({ to: `/books/${book.id}` });
    };

    const handleLibraryAction = () => {
    if (isSaved) {
            removeBook(book.id);
            toast({
                title: "Removido da estante",
                description: `${displayBook.title} não está mais na sua biblioteca.`,
                variant: "destructive",
            });
        } else {
            addBook(fullBook || book);
            toast({
                title: "Adicionado com sucesso!",
                description: `${displayBook.title} agora está na sua biblioteca.`,
                className: "bg-emerald-500 text-white border-none",
            });
        }
    };

    const displayBook = fullBook || book;

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {isOpen && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" 
                            />
                        </Dialog.Overlay>
                        
                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
                                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                                exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
                                className="fixed left-1/2 top-1/2 w-[90vw] max-w-[650px] bg-white dark:bg-card rounded-[40px] shadow-2xl z-[101] focus:outline-none p-10 overflow-visible"
                            >
                                <div className="flex flex-col md:flex-row gap-8 relative">
                                    <div className="relative w-full md:w-2/5 shrink-0">
                                        <div className="md:absolute md:-top-16 w-full aspect-[2/3] rounded-3xl overflow-hidden shadow-[-5px_15px_10px_rgba(0,0,0,0.2)] z-10">
                                            <img 
                                                src={displayBook.coverUrl} 
                                                className="w-full h-full object-cover" 
                                                alt={displayBook.title} 
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between space-y-6 pt-2">
                                        <div>
                                            <h2 className="text-3xl font-bold leading-tight tracking-tight">
                                                {displayBook.title}
                                            </h2>
                                            <p className="text-secondary font-medium italic mt-1">
                                                {displayBook.author}
                                            </p>
                                            
                                            <div className="mt-4">
                                                {isLoading ? (
                                                    <div className="space-y-2">
                                                        <div className="h-3 bg-muted animate-pulse rounded w-full" />
                                                        <div className="h-3 bg-muted animate-pulse rounded w-5/6" />
                                                        <div className="h-3 bg-muted animate-pulse rounded w-4/6" />
                                                    </div>
                                                ) : (
                                                    <p className="text-muted-foreground/80 text-sm leading-relaxed line-clamp-6">
                                                        {displayBook.description || "Este livro ainda não possui uma descrição disponível na Open Library."}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {isSaved && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="p-4 bg-muted/30 rounded-2xl border border-border/20 flex items-center justify-between"
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progresso</span>
                                                    <StatusBadge 
                                                        bookId={book.id} 
                                                        currentStatus={libraryBook?.status || 'WANT_TO_READ'} 
                                                    />
                                                </motion.div>
                                            )}

                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={handleMoreDetails} 
                                                    className="flex-1 rounded-2xl h-12 bg-accent text-white font-bold hover:scale-[1.02] transition-transform"
                                                >
                                                    Mais detalhes
                                                </button>
                                                
                                                <button 
                                                    onClick={handleLibraryAction}
                                                    className={`rounded-2xl h-12 transition-all duration-300 ${
                                                        !isSaved ? "border-secondary/30 text-secondary hover:bg-secondary/10 px-6" : "px-4"
                                                    }`}
                                                >
                                                    {isSaved ? <Trash2 size={20} /> : <><Plus className="mr-2 h-4 w-4"/> Biblioteca</>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Dialog.Close asChild>
                                    <button className="absolute top-6 right-8 text-muted-foreground/50 hover:text-foreground transition-colors">
                                        <X size={24} />
                                    </button>
                                </Dialog.Close>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}