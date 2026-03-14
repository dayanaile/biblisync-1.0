import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookService } from "../../../entities/book/api/book.service";
import { Search, Plus, BookOpen, Trash2, X } from "lucide-react";
import { useLibraryStore } from "../../../shared/lib/store/use-library-store";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
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
        });
    };

    const handleRemoveBook = (e: React.MouseEvent, book: any) => {
        e.stopPropagation();
        removeBook(book.id);
        toast({
            title: "Removido",
            description: "O livro foi retirado da sua estante.",
        });
    };

    const SearchItemSkeleton = () => (
        <div className="flex items-center gap-4 p-4 mb-2">
            <div className="skeleton w-14 h-20 shrink-0 rounded-lg"></div>
            <div className="flex-1 space-y-3">
                <div className="skeleton h-4 w-3/4 rounded-full"></div>
                <div className="skeleton h-3 w-1/2 rounded-full opacity-60"></div>
                <div className="skeleton h-2 w-full mt-2 rounded-full opacity-40"></div>
            </div>
            <div className="skeleton w-10 h-10 rounded-xl opacity-50"></div>
        </div>
    );

    return (
        <div className={`relative w-full z-50 ${className}`} ref={dropdownRef}>
            {/* INPUT CONTAINER */}
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors">
                    <Search size={18} />
                </div>
                
                <input
                    type="text"
                    placeholder="Buscar por título ou autor..."
                    className="input input-bordered w-full pl-12 pr-12 h-11 rounded-xl bg-base-200/50 border-base-300 focus:input-primary transition-all text-sm font-medium"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isLoading ? (
                        <span className="loading loading-spinner loading-xs text-primary"></span>
                    ) : query.length > 0 && (
                        <button
                            onClick={() => {
                                setQuery("");
                                setIsDropdownOpen(false);
                            }}
                            className="btn btn-ghost btn-circle btn-xs opacity-40 hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* DROPDOWN RESULTS */}
            <AnimatePresence>
                {isDropdownOpen && query.length > 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full mt-2 w-full bg-base-100 rounded-[24px] shadow-2xl border border-base-200 overflow-hidden"
                    >
                        <div className="max-h-[400px] overflow-y-auto p-2 no-scrollbar">
                            {isLoading ? (
                                <>
                                    <SearchItemSkeleton />
                                    <SearchItemSkeleton />
                                </>
                            ) : (
                                <>
                                    {suggestions?.length === 0 ? (
                                        <div className="p-10 text-center flex flex-col items-center gap-2">
                                            <span className="text-3xl">🕵️‍♂️</span>
                                            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">
                                                Nenhum livro encontrado
                                            </p>
                                        </div>
                                    ) : (
                                        suggestions?.map((book) => (
                                            <div 
                                                key={book.id}
                                                onClick={() => handleSelectBook(book.id)}
                                                className="flex items-center gap-4 p-3 hover:bg-base-200 rounded-2xl transition-all group cursor-pointer border border-transparent mb-1"
                                            >
                                                <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden shadow-sm bg-base-300">
                                                    <img src={book.coverUrl} className="w-full h-full object-cover" alt={book.title} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm text-base-content truncate group-hover:text-primary transition-colors">
                                                        {book.title}
                                                    </h4>
                                                    <p className="text-[11px] opacity-60 italic truncate">{book.author}</p>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {isInLibrary(book.id) ? (
                                                        <div className="flex gap-1">
                                                            <div className="btn btn-square btn-ghost btn-sm text-success pointer-events-none">
                                                                <BookOpen size={16} />
                                                            </div>
                                                            <button
                                                                onClick={(e) => handleRemoveBook(e, book)}
                                                                className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => handleAddBook(e, book)}
                                                            className="btn btn-square btn-primary btn-sm rounded-xl text-white shadow-md shadow-primary/20"
                                                        >
                                                            <Plus size={18} />
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