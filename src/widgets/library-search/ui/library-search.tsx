import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookService } from "../../../entities/book/api/book.service";
import { Input } from "../../../shared/ui/input";
import { Search, Loader2, Plus, BookOpen, Trash2, X } from "lucide-react";
import { useLibraryStore } from "../../../shared/lib/store/use-library-store";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Skeleton } from "../../../shared/ui/skeleton";
import { useToast } from "../../../shared/hooks/use-toast";

interface Props {
  className?: string;
}

export function LibrarySearch({ className }: Props) {
    const { toast } = useToast();
    const [query, setQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { addBook, removeBook, isInLibrary } = useLibraryStore();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { data: suggestions, isLoading } = useQuery({
        queryKey: ["search-suggestions", query],
        queryFn: () => bookService.searchBooks(query, "Todos"),
        enabled: query.length > 2,
        staleTime: 1000 * 60,
    });

    const handleSelectBook = (bookId: string) => {
        navigate({ to: `/books/${bookId}` });
        setIsDropdownOpen(false);
        setQuery("");
    };

    const handleAddBook = (e: React.MouseEvent, book: any) => {
        e.stopPropagation();
        addBook(book);
        toast({
            title: "Adicionado!",
            description: `${book.title} já está na sua biblioteca.`,
            className: "bg-emerald-500 text-white border-none shadow-emerald-200",
        });
    };

    const handleRemoveBook = (e: React.MouseEvent, book: any) => {
        e.stopPropagation();
        removeBook(book.id);
        toast({
            title: "Removido",
            description: "O livro foi retirado da sua estante.",
            variant: "destructive",
        });
    };

    const SearchItemSkeleton = () => (
        <div className="flex items-center gap-4 p-3 mb-2">
            <Skeleton className="w-14 h-20 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2 w-full mt-2" />
            </div>
            <Skeleton className="w-10 h-10 rounded-xl" />
        </div>
    );

    return (
        <div className={`relative w-[70%] max-w-2xl mx-auto mb-12 z-50 ${className}`} ref={dropdownRef}>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                    placeholder="Digite o nome do livro ou autor..."
                    className="pl-12 h-12 rounded-2xl border-none shadow-xl bg-white dark:bg-card text-lg focus-visible:ring-2 focus-visible:ring-secondary transition-all"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query.length > 0 && !isLoading && (
                        <button
                            onClick={() => {
                                setQuery("");
                                setIsDropdownOpen(false);
                            }}
                            className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                    {isLoading && <Loader2 className="animate-spin text-secondary" size={20} />}
                </div>
            </div>

            <AnimatePresence>
                {isDropdownOpen && query.length > 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-3 w-full bg-white dark:bg-card rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-border/40 overflow-hidden"
                    >
                        <div className="max-h-[450px] overflow-y-auto custom-scrollbar p-3">
                            
                            {isLoading ? (
                                <>
                                    <SearchItemSkeleton />
                                    <SearchItemSkeleton />
                                    <SearchItemSkeleton />
                                </>
                            ) : (
                                <>
                                    {suggestions?.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">
                                            Nenhum livro encontrado para "{query}"
                                        </div>
                                    ) : (
                                        suggestions?.map((book) => (
                                            <div 
                                                key={book.id}
                                                onClick={() => handleSelectBook(book.id)}
                                                className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-secondary/20 mb-2"
                                            >
                                                <div className="w-14 h-20 shrink-0 rounded-lg overflow-hidden shadow-md">
                                                    <img src={book.coverUrl} className="w-full h-full object-cover" alt={book.title} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-base text-foreground truncate group-hover:text-secondary transition-colors">
                                                        {book.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground italic truncate">{book.author}</p>
                                                    <p className="text-[11px] text-muted-foreground/60 line-clamp-1 mt-1 leading-tight">
                                                        {book.description || "Clique para ver detalhes do livro..."}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {isInLibrary(book.id) ? (
                                                        <div className="flex items-center gap-1">
                                                            <div className="p-2 text-green-600 bg-green-100 rounded-xl">
                                                                <BookOpen size={18} />
                                                            </div>
                                                            <button
                                                                onClick={(e) => handleRemoveBook(e, book)}
                                                                className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => handleAddBook(e, book)}
                                                            className="p-3 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Plus size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}