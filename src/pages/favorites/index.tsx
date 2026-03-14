import { useFavoritesStore } from "../../shared/lib/store/use-favorites-store";
import { FavoritesBanner } from "../library/ui/favorites-banner";
import { LibraryBookCard } from "../library/ui/library-book-card";
import { motion, AnimatePresence } from "framer-motion";
import { HeartOff } from "lucide-react"; 

export function FavoritesPage() {
    const { books } = useFavoritesStore();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <FavoritesBanner />

            <div className="card bg-base-100 p-6 md:p-10 rounded-[40px] shadow-sm border border-base-200 min-h-[500px]">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 px-4">
                    <div className="space-y-1">
                        <h1 className="font-heading text-4xl md:text-5xl uppercase tracking-tighter text-primary leading-none">
                            Meus <br /> <span className="text-warning">Favoritos</span>
                        </h1>
                        <div className="h-1 w-20 bg-warning rounded-full" />
                    </div>

                    <div className="stats shadow bg-base-200 border border-base-300">
                        <div className="stat py-2 px-6">
                            <div className="stat-title text-[10px] uppercase font-black tracking-widest">Total</div>
                            <div className="stat-value text-2xl text-primary">{books.length}</div>
                            <div className="stat-desc font-medium">
                                {books.length === 1 ? 'livro salvo' : 'livros salvos'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOGICA DE LISTAGEM */}
                {books.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-base-200/30 rounded-[32px] border-2 border-dashed border-base-300"
                    >
                        <div className="bg-base-100 p-6 rounded-full shadow-inner mb-4">
                            <HeartOff className="text-base-300" size={48} />
                        </div>
                        <h3 className="text-xl font-bold opacity-70">Sua lista está vazia</h3>
                        <p className="text-sm opacity-50 max-w-xs mt-2 italic">
                            Dê um coração para os livros que você mais ama na sua Biblioteca para vê-los aqui!
                        </p>
                        <button className="btn btn-primary btn-outline btn-sm mt-6 rounded-full px-8">
                            Explorar Biblioteca
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
                        <AnimatePresence mode="popLayout">
                            {books.map((book) => (
                                <motion.div
                                    key={book.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
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