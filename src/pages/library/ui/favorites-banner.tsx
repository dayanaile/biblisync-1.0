import { useState, useEffect } from "react";
import { useFavoritesStore } from "../../../shared/lib/store/use-favorites-store";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Star, ChevronRight, BookHeart } from "lucide-react";

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
        <div className="relative w-full h-[320px] mb-12 rounded-[50px] overflow-hidden bg-neutral group shadow-2xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentBook.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="absolute inset-0 flex items-center px-8 md:px-20"
                >
                    {/* BACKGROUND COM OVERLAY DO DAISYUI */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={currentBook.coverUrl} 
                            className="w-full h-full object-cover opacity-20 blur-2xl scale-125" 
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral via-neutral/90 to-transparent" />
                    </div>

                    <div className="relative z-10 flex items-center gap-12 w-full">
                        {/* COVER COM EFEITO DE HOVER DAISYUI */}
                        <div 
                            className="hidden md:block w-36 shrink-0 aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 active:scale-95 group-hover:ring-2 ring-primary/50"
                            onClick={() => navigate({ to: `/books/${currentBook.id}` })}
                        >
                            <img src={currentBook.coverUrl} className="w-full h-full object-cover" alt={currentBook.title} />
                        </div>

                        <div className="flex-1 space-y-5">
                            <div className="badge badge-primary badge-outline gap-2 font-black uppercase tracking-[0.2em] text-[10px] py-3">
                                <Star size={12} fill="currentColor" />
                                Destaque dos Favoritos
                            </div>
                            
                            <div className="space-y-1">
                                <h2 className="text-4xl md:text-5xl font-black text-neutral-content leading-[0.9] uppercase tracking-tighter">
                                    {currentBook.title}
                                </h2>
                                <p className="text-primary font-medium italic text-lg opacity-90">{currentBook.author}</p>
                            </div>

                            <button 
                                onClick={() => navigate({ to: `/books/${currentBook.id}` })}
                                className="btn btn-primary btn-sm rounded-full px-6 gap-2 group/btn normal-case font-bold"
                            >
                                <BookHeart size={16} />
                                Ver na Estante
                                <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* INDICADORES (PAGINAÇÃO) COM ESTILO DAISYUI */}
            {lastFavorites.length > 1 && (
                <div className="absolute bottom-10 left-8 md:left-20 flex gap-1.5 z-20">
                    {lastFavorites.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 transition-all duration-500 rounded-full ${
                                idx === currentIndex ? "w-10 bg-primary" : "w-3 bg-neutral-content/20 hover:bg-neutral-content/40"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}