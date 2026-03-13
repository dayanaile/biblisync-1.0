import type { Book } from "../model/types";

export const mapGoogleBookToEntity = (item: any): Book => ({
    id: item.id,
    title: item.volumeInfo.title || "Título Indisponível",
    author: item.volumeInfo.authors?.[0] || "Autor Desconhecido",
    coverUrl: item.volumeInfo.imageLinks?.thumbnail || "https://placehold.co/400x600?text=Sem+Capa",
    description: item.volumeInfo.description,
    pages: item.volumeInfo.pageCount,
    year: item.volumeInfo.publishedDate?.split('-')[0] || "N/A",
    printType: item.printType === 'MAGAZINE' ? 'magazines' : 'books',
    genres: [],
    read: false
});