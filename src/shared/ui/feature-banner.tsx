// src/shared/ui/featured-banner.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Star, ChevronRight, Sparkles } from "lucide-react";
import type { Book } from "../../entities/book/model/types";

interface FeaturedBannerProps {
    books: Book[];
    titlePrefix: string;
    titleHighlight: string;
    icon?: "star" | "sparkles";
}

export function FeaturedBanner({ books, titlePrefix, titleHighlight, icon = "sparkles" }: FeaturedBannerProps) {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const displayBooks = books.slice(0, 3);

    useEffect(() => {
        if (displayBooks.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayBooks.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [displayBooks.length]);

    if (displayBooks.length === 0) return null;

    const currentBook = displayBooks[currentIndex];

    return (
        <div className="relative w-full h-[350px] rounded-[50px] overflow-hidden bg-amber-900 group shadow-2xl dark:bg-input">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentBook.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex items-center px-12 md:px-20"
                >
                    <div className="absolute inset-0 z-0">
                        <img src={currentBook.coverUrl} className="w-full h-full object-cover opacity-40 blur-2xl scale-125" alt="" />
                        <div className="absolute inset-0 from-amber-950 via-amber-950/80 to-transparent dark:from-secondary dark:via-secondary dark:to-transparent" />
                    </div>

                    <div className="relative z-10 flex items-center gap-12 w-full">
                        <div 
                            className="hidden md:block w-40 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform duration-500"
                            onClick={() => navigate({ to: `/books/${currentBook.id}` })}
                        >
                            <img src={currentBook.coverUrl} className="w-full h-full object-cover" alt={currentBook.title} />
                        </div>

                        <div className="flex-1 space-y-5">
                            <div className="flex items-center gap-2 text-accent text-sm font-bold uppercase tracking-[0.2em]">
                                {icon === "star" ? <Star size={16} fill="currentColor" /> : <Sparkles size={16} />}
                                {titlePrefix}
                            </div>
                            
                            <h2 className="text-2xl md:text-4xl font-heading text-white leading-[0.9] tracking-tighter">
                                {currentBook.title}
                            </h2>
                            
                            <p className="text-card text-lg font-light italic opacity-80 dark:text-amber-100">{currentBook.author}</p>

                            <button 
                                onClick={() => navigate({ to: `/books/${currentBook.id}` })}
                                className="inline-flex items-center gap-3 px-8 py-3 bg-white text-amber-950 rounded-full font-bold hover:bg-secondary hover:text-white transition-all group/btn"
                            >
                                Explorar Obra <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-10 right-20 flex gap-3 z-20">
                {displayBooks.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${
                            idx === currentIndex ? "w-10 bg-accent dark:bg-card" : "w-3 bg-white/20 hover:bg-white/40"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}