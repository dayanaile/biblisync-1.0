import { useLibraryStore } from "../../shared/lib/store/use-library-store";
import { useFilterStore } from "../../shared/lib/store/use-filter-store";
import { LibraryBookCard } from "./ui/library-book-card";
import { FavoritesBanner } from "./ui/favorites-banner";
import { BookFilters } from "../../shared/ui/book-filters"; 
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@tanstack/react-router";
import { LibraryBig, SearchX } from "lucide-react";

export function LibraryPage() {
    const { books } = useLibraryStore();
    const { printType, orderBy } = useFilterStore();
    
    const { status } = useSearch({ from: '/layout/library' }) as { status?: string };

    const filteredBooks = books.filter(book => {
        const bookStatus = book.status || 'WANT_TO_READ';
        if (status && bookStatus !== status) return false;
        
        const bookType = book.printType?.toLowerCase();
        const filterValue = printType.toLowerCase();

        if (filterValue === 'books') return bookType === 'books' || bookType === 'book';
        if (filterValue === 'magazines') return bookType === 'magazines' || bookType === 'magazine';
        if (printType === 'all') return true;
        return bookType === filterValue;
    });

    const sortedBooks = [...filteredBooks].sort((a, b) => {
        if (orderBy === 'newest') return (b.year || 0) - (a.year || 0);
        return a.title.localeCompare(b.title);
    });

    const getPageTitle = () => {
        switch(status) {
            case 'WANT_TO_READ': return <>Quero <br /> <span className="text-primary">Ler</span></>;
            case 'READING': return <>Lendo <br /> <span className="text-primary">Agora</span></>;
            case 'COMPLETED': return <>Lidos & <br /> <span className="text-primary">Concluídos</span></>;
            default: return <>Minha <br /> <span className="text-primary">Biblioteca</span></>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {!status && <FavoritesBanner />}

            {/* CONTAINER PRINCIPAL */}
            <div className="card bg-base-100 p-6 md:p-12 rounded-[40px] shadow-sm border border-base-200 min-h-[550px]">
                
                {/* HEADER COM TITULO E FILTROS */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8 px-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="space-y-1">
                            <h1 className="font-heading text-4xl md:text-5xl uppercase tracking-tighter text-base-content leading-none">
                                {getPageTitle()}
                            </h1>
                            <div className="h-1.5 w-16 bg-primary rounded-full" />
                        </div>

                        {/* STATS COMPONENT PARA O CONTADOR */}
                        <div className="stats bg-base-200 shadow-sm border border-base-300">
                            <div className="stat py-2 px-6">
                                <div className="stat-title text-[10px] uppercase font-black tracking-widest opacity-60">Resultados</div>
                                <div className="stat-value text-2xl text-primary">{filteredBooks.length}</div>
                                <div className="stat-desc font-bold uppercase text-[9px]">Itens na estante</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full lg:w-auto">
                        <BookFilters />
                    </div>
                </div>

                {/* LOGICA DE LISTAGEM / EMPTY STATE */}
                {sortedBooks.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-base-200/40 rounded-[32px] border-2 border-dashed border-base-300 mx-4"
                    >
                        <div className="avatar placeholder mb-6">
                            <div className="bg-neutral text-neutral-content rounded-full w-20">
                                {books.length > 0 ? <SearchX size={40} /> : <LibraryBig size={40} />}
                            </div>
                        </div>
                        
                        <div className="max-w-md space-y-2">
                            <h3 className="text-xl font-bold text-base-content uppercase tracking-tight">
                                {books.length > 0 ? "Nada por aqui..." : "Sua biblioteca está vazia"}
                            </h3>
                            <p className="text-sm opacity-60 italic leading-relaxed">
                                {books.length > 0 
                                    ? `Não encontramos livros com o status "${status || 'Biblioteca'}" para os filtros selecionados.` 
                                    : "Parece que você ainda não adicionou nenhum livro. Que tal explorar os bestsellers e começar sua coleção?"}
                            </p>
                        </div>

                        {books.length === 0 && (
                            <button className="btn btn-primary btn-wide rounded-full mt-8 shadow-lg shadow-primary/20">
                                Descobrir Livros
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-16">
                        <AnimatePresence mode="popLayout">
                            {sortedBooks.map((book) => (
                                <motion.div
                                    key={book.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <LibraryBookCard book={book} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}