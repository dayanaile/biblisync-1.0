import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { bookService } from "../../entities/book/api/book.service";
import { useLibraryStore } from "../../shared/lib/store/use-library-store";
import { BookOpen, Calendar, ExternalLink, Library, Clock, Play, CheckCircle2 } from "lucide-react";
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

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <span className="loading loading-ring loading-lg text-primary"></span>
            <p className="animate-pulse font-bold text-primary uppercase tracking-widest text-xs">Organizando estante...</p>
        </div>
    );
    
    if (isError || !book) return (
        <div className="p-10 text-center">
            <div className="alert alert-error shadow-lg max-w-md mx-auto">
                <span>Erro ao carregar os detalhes do livro.</span>
            </div>
        </div>
    );

    const handleLibraryAction = () => {
        if (isSaved) {
            removeBook(bookId);
            toast({ title: "Removido", description: "Livro removido da sua estante." });
        } else {
            addBook(book);
            toast({ title: "Adicionado!", description: "O livro foi salvo na sua biblioteca." });
        }
    }

    const statusConfig = {
        WANT_TO_READ: { 
            icon: <Clock size={16} />, 
            badgeClass: "badge-ghost" 
        },
        READING: { 
            icon: <Play size={14} className="fill-current" />, 
            badgeClass: "badge-warning" 
        },
        COMPLETED: { 
            icon: <CheckCircle2 size={16} />, 
            badgeClass: "badge-success text-white" 
        },
    };

    const currentStatus = libraryBook?.status || 'WANT_TO_READ';
    const activeConfig = statusConfig[currentStatus];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-6xl mx-auto p-4 md:pt-10"
        >
            {/* CARD PRINCIPAL USANDO CLASSES DAISYUI */}
            <div className="card lg:card-side bg-base-100 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-base-200 overflow-hidden rounded-[40px]">
                
                {/* LADO ESQUERDO: IMAGEM E GÊNEROS */}
                <figure className="lg:w-2/5 p-8 md:p-12 bg-base-200/50 flex flex-col gap-8">
                    <motion.div 
                        whileHover={{ rotateY: 15, perspective: 1000 }}
                        className="relative group"
                    >
                        <img 
                            src={book.coverUrl} 
                            className="w-full max-w-[300px] rounded-[32px] shadow-2xl transition-all duration-500 group-hover:shadow-primary/20" 
                            alt={book.title} 
                        />
                        <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/20" />
                    </motion.div>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                        {book.genres.map((genre) => (
                            <div key={genre} className="badge badge-outline border-primary/30 text-primary font-bold text-[10px] uppercase tracking-tighter p-3">
                                {genre}
                            </div>
                        ))}
                    </div>
                </figure>

                {/* LADO DIREITO: CONTEÚDO */}
                <div className="card-body lg:w-3/5 p-8 md:p-16">
                    <div className="space-y-6">
                        <header className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black leading-none uppercase tracking-tighter text-base-content">
                                {book.title}
                            </h1>
                            <p className="text-xl opacity-60 font-medium italic">by {book.author}</p>
                        </header>

                        {/* STATS GRID */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-base-200/30 rounded-box border border-base-200">
                            <div className="flex items-center gap-3">
                                <div className="avatar placeholder">
                                    <div className="bg-primary text-primary-content rounded-full w-10">
                                        <BookOpen size={20} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase opacity-50 font-black">Páginas</p>
                                    <p className="font-bold text-sm">{book.pages || "---"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="avatar placeholder">
                                    <div className="bg-primary text-primary-content rounded-full w-10">
                                        <Calendar size={20} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase opacity-50 font-black">Ano</p>
                                    <p className="font-bold text-sm">{book.year}</p>
                                </div>
                            </div>
                            
                            {isSaved && (
                                <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                                    <div className="indicator">
                                        <span className={`indicator-item badge badge-xs ${activeConfig.badgeClass.replace('text-white', '')} animate-pulse`}></span>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-inner ${activeConfig.badgeClass}`}>
                                            {activeConfig.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-primary font-black">Status</p>
                                        <p className="text-[11px] font-bold">Na Estante</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SINOPSE */}
                        <div className="space-y-3">
                            <div className="divider divider-start font-black uppercase tracking-[0.2em] text-[10px] text-primary">Sinopse</div>
                            <div className="text-sm leading-relaxed opacity-80 max-h-[150px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
                                {book.description || "Este livro não possui uma descrição disponível."}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="card-actions flex flex-wrap gap-4 pt-6">
                            <button 
                                onClick={handleLibraryAction}
                                className={`btn btn-lg flex-1 rounded-2xl h-16 font-black uppercase tracking-widest text-xs transition-all active:scale-95 ${
                                    isSaved 
                                    ? "btn-error btn-outline" 
                                    : "btn-primary shadow-[0_10px_30px_rgba(252,167,44,0.3)] text-white"
                                }`}
                            >
                                <Library size={20} />
                                {isSaved ? "Remover" : "Adicionar à Biblioteca"}
                            </button>
                            
                            <button className="btn btn-outline btn-lg rounded-2xl h-16 px-6">
                                <ExternalLink size={20} className="text-primary" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}