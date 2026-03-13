import axios from 'axios';
import type { Book } from "../model/types";

const GOOGLE_API_KEY = "AIzaSyDh_NJENOVN0eSvv5G6Zv40Bz1nhvjwqkQ";

const apiClient = axios.create({
    baseURL: "https://www.googleapis.com/books/v1",
    params: {
        key: GOOGLE_API_KEY || undefined,
    }
});

const mapGoogleBook = (item: any): Book => {
    const info = item.volumeInfo;
    const pType = info.printType?.toLowerCase() || "books";
    
    const defaultCover = "https://placehold.co/400x600/e2e8f0/475569?text=Sem+Capa";
    
    return {
        id: item.id,
        title: info.title || "Título Indisponível",
        author: info.authors?.[0] || "Autor Desconhecido",
        year: info.publishedDate ? new Date(info.publishedDate).getFullYear() : 0,
        genres: info.categories?.slice(0, 2) || [],
        coverUrl: info.imageLinks?.thumbnail 
            ? info.imageLinks.thumbnail.replace('http:', 'https:') 
            : defaultCover,
        description: info.description?.replace(/<[^>]*>?/gm, '') || "Sem descrição disponível.",
        pages: info.pageCount || 0,
        read: false,
        printType: pType === 'magazine' ? 'magazines' : 'books',
    };
};

export const bookService = {
    getBestsellers: async (startIndex = 0, printType = 'all', orderBy = 'relevance'): Promise<Book[]> => {
        const response = await apiClient.get("/volumes", {
            params: {
                q: "best+sellers+fiction",
                maxResults: 12,
                startIndex,
                orderBy,
                printType: printType === 'all' ? undefined : printType,
            },
        });
        return (response.data.items || []).map(mapGoogleBook);
    },

    getByGenre: async (genre: string, startIndex = 0, printType = 'all', orderBy = 'relevance'): Promise<Book[]> => {
        const response = await apiClient.get("/volumes", {
            params: {
                q: `subject:${genre.toLowerCase()}`,
                maxResults: 12,
                startIndex,
                printType: printType === 'all' ? undefined : printType,
                orderBy,
            },
        });
        return (response.data.items || []).map(mapGoogleBook);
    },

    searchBooks: async (query: string, genre: string, startIndex = 0, printType = 'all', orderBy = 'relevance'): Promise<Book[]> => {
        if (!query && genre === "Todos") return [];
        
        let q = query || "reading";
        if (genre !== "Todos") q += `+subject:${genre}`;

        const response = await apiClient.get("/volumes", {
            params: {
                q,
                maxResults: 20,
                startIndex,
                printType: printType === 'all' ? undefined : printType,
                orderBy,
            },
        });
        return (response.data.items || []).map(mapGoogleBook);
    },

    getById: async (id: string): Promise<Book | null> => {
        const response = await apiClient.get(`/volumes/${id}`);
        return response.data ? mapGoogleBook(response.data) : null;
    }
};