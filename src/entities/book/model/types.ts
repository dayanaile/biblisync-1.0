import { z } from "zod";

export const GoogleBookSchema = z.object({
    id: z.string(),
    volumeInfo: z.object({
        title: z.string(),
        authors: z.array(z.string()).optional(),
        description: z.string().optional(),
        publishedDate: z.string().optional(),
        pageCount: z.number().optional(),
        categories: z.array(z.string()).optional(),
        imageLinks: z.object({
            smallThumbnail: z.string().optional(),
            thumbnail: z.string().optional(),
            small: z.string().optional(),
            medium: z.string().optional(),
            large: z.string().optional(),
            extraLarge: z.string().optional(),
        }).optional(),
    }),
});

export type BookDTO = z.infer<typeof GoogleBookSchema>;
export type BookStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED';

export interface Book {
    id: string;
    title: string;
    author: string;
    year: number;
    coverUrl: string;
    genres: string[];
    pages: number;
    read: boolean;
    description: string;
    printType: 'books' | 'magazines' | string; 
    type?: string;
    status?: BookStatus;
}

export type CreateBookDTO = Omit<Book, "id">;