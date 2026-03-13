import { useQuery } from "@tanstack/react-query";
import { bookService } from "../../../entities/book/api/book.service";
import { bookKeys } from "../../../entities/book/api/book.keys";

export function useBookList() {
    return useQuery({
        queryKey: bookKeys.list(),
        queryFn: () => bookService.searchBooks("", "Todos"),
    })
}