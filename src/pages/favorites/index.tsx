import { useFavoritesStore } from "../../shared/lib/store/use-favorites-store";
import { FavoritesBanner } from "../library/ui/favorites-banner";
import { LibraryBookCard } from "../library/ui/library-book-card";
import { motion, AnimatePresence } from "framer-motion";

export function FavoritesPage() {
    const { books } = useFavoritesStore();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <FavoritesBanner/>
            <div className="bg-white dark:bg-card p-10 rounded-[40px] shadow-sm border border-border/40 min-h-[500px]">
                <div className="flex justify-between items-end mb-10 px-4">
                    <h1 className="font-heading text-4xl uppercase tracking-tighter text-primary">
                        Livros <br /> <span className="text-amber-500">Favoritos</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        {books.length} {books.length === 1 ? 'livro favoritado' : 'livros favoritados'}
                    </p>
                </div>

                {books.length === 0 ? (
                    <div className="h-60 flex flex-col items-center justify-center text-center space-y-4">
                        <p className="text-muted-foreground italic text-lg">
                            Você ainda não favoritou nenhum livro... <br />
                            Use a página da sua Biblioteca para marcar seus preferidos!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12">
                        <AnimatePresence>
                            {books.map((book) => (
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