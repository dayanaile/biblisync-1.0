import { useState, useEffect } from "react";
import { useFavoritesStore } from "../../../shared/lib/store/use-favorites-store";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Star, ChevronRight } from "lucide-react";

export function FavoritesBanner() {
    const { books } = useFavoritesStore();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const lastFavorites = books.slice(-3).reverse();

    useEffect(() => {
        if (lastFavorites.length <= 1) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % lastFavorites.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [lastFavorites.length]);

    if (lastFavorites.length === 0) return null;

    const currentBook = lastFavorites[currentIndex];

    return (
        <div className="relative w-full h-[300px] mb-12 rounded-[50px] overflow-hidden bg-amber-900 group dark:bg-input">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentBook.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="absolute inset-0 flex items-center px-12 md:px-20"
                >
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={currentBook.coverUrl} 
                            className="w-full h-full object-cover opacity-30 blur-3xl scale-110" 
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-amber-950/80 to-transparent dark:from-secondary dark:via-secondary dark:to-transparent" />
                    </div>

                    <div className="relative z-10 flex items-center gap-10 w-full">
                        <div 
                            className="hidden md:block w-32 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500 cursor-pointer"
                            onClick={() => navigate({ to: `/books/${currentBook.id}` })}
                        >
                            <img src={currentBook.coverUrl} className="w-full h-full object-cover" alt={currentBook.title} />
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 text-accent text-sm font-bold uppercase tracking-widest dark:text-card">
                                <Star size={14} fill="currentColor" />
                                Destaque dos Favoritos
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl font-heading text-white leading-none">
                                {currentBook.title}
                            </h2>
                            
                            <p className="text-amber-200 italic text-lg">{currentBook.author}</p>

                            <button 
                                onClick={() => navigate({ to: `/books/${currentBook.id}` })}
                                className="flex items-center gap-2 text-white hover:text-accent transition-colors font-medium group/btn"
                            >
                                Ler detalhes <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {lastFavorites.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {lastFavorites.map((_, idx) => (
                        <div 
                            key={idx}
                            className={`h-1 transition-all duration-500 rounded-full ${
                                idx === currentIndex ? "w-8 bg-accent dark:bg-card" : "w-2 bg-white/20"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}