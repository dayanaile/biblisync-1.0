import type { Book } from "../model/types";
import { useState } from "react";
import { BookPreviewModal } from "./book-preview-modal";
import { useFavoritesStore } from "../../../shared/lib/store/use-favorites-store";
import { Star } from "lucide-react";

export function BookCard({ book }: { book: Book }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { isFavorite } = useFavoritesStore();
  const isFav = isFavorite(book.id);

  return (
    <>
      <div
        onClick={() => setIsPreviewOpen(true)}
        className="group cursor-pointer flex flex-col space-y-4 isolate"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[16px] shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 bg-muted">
          <img 
            src={book.coverUrl} 
            alt={book.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          
          {isFav && (
            <div className="absolute top-0 right-4 z-20">
              <div className="bg-amber-500 text-white p-2 pb-3 rounded-b-md shadow-lg animate-in slide-in-from-top-full duration-500">
                <Star size={16} fill="currentColor" />
              </div>
            </div>
          )}
        </div>

        <div className="px-1">
          <h3 className="font-bold text-sm text-foreground line-clamp-1">{book.title}</h3>
          <p className="text-[11px] text-muted-foreground italic">{book.author}</p>
          <span className="text-[10px] text-accent">{book.year}</span>
        </div>
      </div>

      <BookPreviewModal
        book={book}
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </>
  );
}