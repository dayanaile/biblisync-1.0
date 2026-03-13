import { useEffect, useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { bookService } from "../../entities/book/api/book.service";
import { useFilterStore } from "../../shared/lib/store/use-filter-store";
import { Skeleton } from "../../shared/ui/skeleton";
import { bookKeys } from "../../entities/book/api/book.keys";
import { BookCard } from "../../entities/book/ui/book-card";
import { FeaturedBanner } from "../../shared/ui/feature-banner";
import { Loader2, ArrowUp } from "lucide-react";
import { BookFilters } from "../../shared/ui/book-filters";
import { Button } from "../../shared/ui/button";

export function HomePage() {
  const { selectedGenre, printType, orderBy } = useFilterStore();
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [showScrollButton, setShowScrollButton] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [...bookKeys.list(), selectedGenre, printType, orderBy],
    queryFn: ({ pageParam = 0 }) => {
      return selectedGenre === "Todos" 
        ? bookService.getBestsellers(pageParam, printType, orderBy) 
        : bookService.getByGenre(selectedGenre, pageParam, printType, orderBy);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < 12) return undefined;
      return allPages.length * 12;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30, 
    refetchOnWindowFocus: false,
  });

  const allBooks = useMemo(() => data?.pages.flat() || [], [data]);
  const bannerBooks = useMemo(() => allBooks.slice(0, 3), [allBooks]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    const handleScroll = () => {
      if (mainElement) setShowScrollButton(mainElement.scrollTop > 800);
    };

    mainElement?.addEventListener('scroll', handleScroll);
    return () => mainElement?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isError) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <p className="text-muted-foreground font-medium">Ops! Tivemos um problema ao conectar com a biblioteca.</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Tentar novamente</Button>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <h1 className="font-heading text-[2.8rem] md:text-[3.2rem] leading-[0.85] text-primary uppercase tracking-tighter">
            {selectedGenre === "Todos" ? (
              <>Popular <br /> Bestsellers</>
            ) : (
              <>Bestsellers <br /> <span className="text-secondary text-[0.8em]">de {selectedGenre}</span></>
            )}
        </h1>
        <BookFilters />
      </div>

      <div className="pb-12">
        {isLoading ? (
          <Skeleton className="h-[320px] w-full rounded-[40px]" />
        ) : bannerBooks.length > 0 ? (
          <FeaturedBanner 
                key={selectedGenre + printType + orderBy} // Força re-animação ao trocar filtros
                books={bannerBooks} 
                titlePrefix={selectedGenre === "Todos" ? "Novos" : "Destaques"} 
                titleHighlight={selectedGenre === "Todos" ? "Lançamentos" : selectedGenre}
                icon="sparkles"
            />
        ) : null}
      </div>

      <div className="bg-white dark:bg-card p-6 md:p-10 rounded-[40px] shadow-sm border border-border/40 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full rounded-[32px]" />
            ))
          ) : (
            <>
              {allBooks.map((book, index) => (
                <BookCard key={`${book.id}-${index}`} book={book} />
              ))}
              
              <div ref={ref} className="col-span-full flex justify-center items-center p-12 mt-4 border-t border-dashed border-border/60">
                {isFetchingNextPage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-secondary" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Buscando mais...</span>
                  </div>
                ) : hasNextPage ? (
                  <div className="h-4 w-4 rounded-full bg-secondary animate-pulse" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">✨</span>
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Fim da estante</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showScrollButton && (
        <Button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-secondary text-white z-50 animate-in zoom-in-50 duration-300"
          size="icon"
        >
          <ArrowUp size={24} />
        </Button>
      )}
    </div>
  );
}