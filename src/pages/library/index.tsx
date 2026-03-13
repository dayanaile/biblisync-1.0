import { useLibraryStore } from "../../shared/lib/store/use-library-store";
import { useFilterStore } from "../../shared/lib/store/use-filter-store";
import { LibraryBookCard } from "./ui/library-book-card";
import { FavoritesBanner } from "./ui/favorites-banner";
import { BookFilters } from "../../shared/ui/book-filters"; 
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@tanstack/react-router";

export function LibraryPage() {
    const { books } = useLibraryStore();
    const { printType, orderBy } = useFilterStore();
    
    const { status } = useSearch({ from: '/layout/library' }) as { status?: string };

    const filteredBooks = books.filter(book => {
        const bookStatus = book.status || 'WANT_TO_READ';

        if (status && bookStatus !== status) return false;
        
        const bookType = book.printType?.toLowerCase();
        const filterValue = printType.toLowerCase();

        if (filterValue === 'books') {
            return bookType === 'books' || bookType === 'book';
        }
        if (filterValue === 'magazines') {
            return bookType === 'magazines' || bookType === 'magazine';
        }

        if (printType === 'all') return true;
        return bookType === filterValue;
    });

    const sortedBooks = [...filteredBooks].sort((a, b) => {
        if (orderBy === 'newest') {
            return (b.year || 0) - (a.year || 0);
        }
        return a.title.localeCompare(b.title);
    });

    const getPageTitle = () => {
        switch(status) {
            case 'WANT_TO_READ': return <>Quero <br /> <span className="text-secondary">Ler</span></>;
            case 'READING': return <>Lendo <br /> <span className="text-secondary">Agora</span></>;
            case 'COMPLETED': return <>Lidos & <br /> <span className="text-secondary">Concluídos</span></>;
            default: return <>Minha <br /> <span className="text-secondary">Biblioteca</span></>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {!status && <FavoritesBanner />}

            <div className="bg-white dark:bg-card p-10 rounded-[40px] shadow-sm border border-border/40 min-h-[500px]">
                <div className="flex justify-between items-center mb-10 px-4">
                    <div className="flex flex-col">
                        <h1 className="font-heading text-4xl uppercase tracking-tighter text-primary leading-none">
                            {getPageTitle()}
                        </h1>
                        <p className="text-muted-foreground font-medium mt-2">
                            {filteredBooks.length} {filteredBooks.length === 1 ? 'item encontrado' : 'itens encontrados'}
                        </p>
                    </div>
                    
                    <BookFilters />
                </div>

                {sortedBooks.length === 0 ? (
                    <div className="h-60 flex flex-col items-center justify-center text-center space-y-4">
                        <p className="text-muted-foreground italic text-lg">
                            {books.length > 0 
                                ? `Nenhum livro marcado como "${status || 'Biblioteca'}" corresponde aos filtros.` 
                                : "Sua biblioteca ainda está vazia..."}
                            <br />
                            {books.length === 0 && "Use a busca acima para encontrar sua próxima leitura!"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12">
                        <AnimatePresence mode="popLayout">
                            {sortedBooks.map((book) => (
                                <motion.div
                                    key={book.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
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