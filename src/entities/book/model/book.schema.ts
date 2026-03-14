import { z } from "zod"

export const bookSchema = z.object({
    title: z.string().min(1, "Título obrigatório"),
    author: z.string().min(1, "Autor obrigatório"),
    pages: z.coerce.number().positive("Deve ser maior que zero"),
    read: z.boolean().default(false),
})

export type BookFormData = z.infer<typeof bookSchema>