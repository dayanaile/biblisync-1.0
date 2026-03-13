import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "../../../entities/book/model/types";

export type BookStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED';

interface LibraryState {
    books: Book[];
    addBook: (book: Book) => void;
    removeBook: (bookId: string) => void;
    isInLibrary: (bookId: string) => boolean;
    updateBookStatus: (bookId: string, status: BookStatus) => void;
}

export const useLibraryStore = create<LibraryState>()(
    persist(
        (set, get) => ({
            books: [],
            
            addBook: (book) => set((state) => ({ 
                books: [...state.books, { ...book, status: book.status || 'WANT_TO_READ' }] 
            })),

            removeBook: (bookId) => set((state) => ({
                books: state.books.filter((b) => b.id !== bookId)
            })),

            isInLibrary: (bookId) => get().books.some((b) => b.id === bookId),

            updateBookStatus: (bookId, status) => set((state) => ({
                books: state.books.map((book) => 
                    book.id === bookId ? { ...book, status } : book
                )
            })),
        }),
        { 
            name: 'user-library',
        }
    )
);