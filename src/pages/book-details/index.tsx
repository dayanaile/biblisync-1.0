import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "../../shared/ui/button";
import { bookService } from "../../entities/book/api/book.service";
import { useLibraryStore } from "../../shared/lib/store/use-library-store";
import { BookOpen, Calendar, ExternalLink, Library, Clock, Play, CheckCircle2 } from "lucide-react";
import { Badge } from "../../shared/ui/badge";
import { useToast } from "../../shared/hooks/use-toast";

export function BookDetailsPage() {
    const { bookId } = useParams({ from: '/layout/books/$bookId' });
    const { toast } = useToast();

    const { data: book, isLoading, isError } = useQuery({
        queryKey: ['book', bookId],
        queryFn: () => bookService.getById(bookId),
        enabled: !!bookId,
    });

    const { removeBook, addBook, isInLibrary, books } = useLibraryStore();
    const isSaved = isInLibrary(bookId);
    const libraryBook = books.find(b => b.id === bookId);

    if (isLoading) return <div className="p-10 animate-pulse text-center font-bold text-secondary">Carregando estante...</div>;
    if (isError || !book) return <div className="p-10 text-center">Erro ao carregar livro.</div>;

    const handleLibraryAction = () => {
    if (isSaved) {
        removeBook(bookId);
        toast({
            title: "Removido",
            description: "Livro removido da sua estante.",
            variant: "destructive",
        });
    } else {
        addBook(book);
        toast({
            title: "Adicionado!",
            description: "O livro foi salvo na sua biblioteca.",
        });
    }
}

    const statusConfig = {
        WANT_TO_READ: { 
            icon: <Clock size={16} />, 
            color: "bg-slate-100 text-slate-600 border-slate-200" 
        },
        READING: { 
            icon: <Play size={14} className="fill-current" />, 
            color: "bg-[#FCA72C]/10 text-[#FCA72C] border-[#FCA72C]/20" 
        },
        COMPLETED: { 
            icon: <CheckCircle2 size={16} />, 
            color: "bg-emerald-50 text-emerald-600 border-emerald-100" 
        },
    };

    const currentStatus = libraryBook?.status || 'WANT_TO_READ';
    const activeConfig = statusConfig[currentStatus];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto p-4 md:pt-10"
        >
            <div className="bg-white dark:bg-card rounded-[40px] p-6 md:p-16 shadow-2xl border border-border/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    
                    <div className="space-y-8 flex flex-col items-center">
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="w-full max-w-[280px] aspect-[2/3] rounded-[40px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-4 border-white dark:border-slate-800"
                        >
                            <img src={book.coverUrl} className="w-full h-full object-cover" alt={book.title} />
                        </motion.div>
                        
                        <div className="flex flex-wrap justify-center gap-2">
                            {book.genres.map((genre) => (
                                <Badge key={genre} variant="secondary" className="px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-[#F2E5D0] text-[#725B3A] hover:bg-[#FCA72C] hover:text-white transition-colors">
                                    {genre}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-heading leading-tight uppercase tracking-tighter text-primary">
                                {book.title}
                            </h1>
                            <p className="text-xl font-light italic text-muted-foreground/60">{book.author}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 p-6 bg-muted/20 rounded-[24px] border border-border/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <BookOpen className="text-secondary" size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase text-muted-foreground font-black">Páginas</p>
                                    <p className="font-bold text-sm">{book.pages || "---"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <Calendar className="text-secondary" size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase text-muted-foreground font-black">Ano</p>
                                    <p className="font-bold text-sm">{book.year}</p>
                                </div>
                            </div>
                            
                            {isSaved && (
                                <div className="flex items-center gap-3 col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-border/20 pt-4 md:pt-0 md:pl-6">
                                    <div className="w-full">
                                        <p className="text-[9px] uppercase text-secondary font-black mb-2">Status</p>
                                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full border shadow-sm transition-transform hover:scale-110 ${activeConfig.color}`}>
                                            {activeConfig.icon}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-secondary">Sinopse</h3>
                            <div className="text-sm leading-relaxed text-muted-foreground/80 max-h-[200px] overflow-y-auto pr-4 custom-scrollbar">
                                {book.description || "Este livro não possui uma descrição disponível."}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-6">
                            <Button 
                                onClick={handleLibraryAction}
                                size="lg" 
                                variant={isSaved ? "destructive" : "default"}
                                className={`flex-1 rounded-[20px] h-16 font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 ${
                                    !isSaved ? "bg-[#FCA72C] hover:bg-[#FCA72C]/90 text-white" : ""
                                }`}
                            >
                                <Library className="mr-3" size={20} />
                                {isSaved ? "Remover da Estante" : "Adicionar à Biblioteca"}
                            </Button>
                            
                            <Button variant="outline" className="rounded-[20px] h-16 px-8 border-2 hover:bg-secondary/5 transition-colors">
                                <ExternalLink size={20} className="text-secondary" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}