import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book } from '../../../entities/book/model/types';

interface FavoritesState {
    books: Book[];
    addFavorite: (book: Book) => void;
    removeFavorite: (bookId: string) => void;
    isFavorite: (bookId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            books: [],
            addFavorite: (book) => set((state) => ({ books: [...state.books, book] })),
            removeFavorite: (bookId) => set((state) => ({ 
                books: state.books.filter((b) => b.id !== bookId) 
            })),
            isFavorite: (bookId) => get().books.some((b) => b.id === bookId),
        }),
        { name: 'user-favorites' }
    )
);