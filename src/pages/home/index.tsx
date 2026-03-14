import { useEffect, useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { bookService } from "../../entities/book/api/book.service";
import { useFilterStore } from "../../shared/lib/store/use-filter-store";
import { bookKeys } from "../../entities/book/api/book.keys";
import { BookCard } from "../../entities/book/ui/book-card";
import { FeaturedBanner } from "../../shared/ui/feature-banner";
import { ArrowUp, Sparkles, AlertCircle } from "lucide-react";
import { BookFilters } from "../../shared/ui/book-filters";

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
    <div className="p-20 flex flex-col items-center justify-center gap-6">
      <div className="alert alert-error max-w-md shadow-lg">
        <AlertCircle />
        <span>Ops! Tivemos um problema ao conectar com a biblioteca.</span>
      </div>
      <button className="btn btn-outline btn-primary px-8 rounded-full" onClick={() => window.location.reload()}>
        Tentar novamente
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                <Sparkles size={14} />
                <span>Explorar Estante</span>
            </div>
            <h1 className="font-heading text-[3rem] md:text-[4rem] leading-[0.8] text-base-content uppercase tracking-tighter">
                {selectedGenre === "Todos" ? (
                <>Popular <br /> <span className="text-primary">Bestsellers</span></>
                ) : (
                <>Bestsellers <br /> <span className="text-primary text-[0.8em]">de {selectedGenre}</span></>
                )}
            </h1>
        </div>
        <BookFilters />
      </div>

      {/* BANNER SECTION */}
      <div className="pb-12">
        {isLoading ? (
          <div className="skeleton h-[350px] w-full rounded-[40px]"></div>
        ) : bannerBooks.length > 0 ? (
          <FeaturedBanner 
                key={selectedGenre + printType + orderBy}
                books={bannerBooks} 
                titlePrefix={selectedGenre === "Todos" ? "Novos" : "Destaques"} 
                titleHighlight={selectedGenre === "Todos" ? "Lançamentos" : selectedGenre}
                icon="sparkles"
            />
        ) : null}
      </div>

      {/* GRID SECTION */}
      <div className="card bg-base-100 p-6 md:p-12 rounded-[40px] shadow-sm border border-base-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4 w-full">
                <div className="skeleton aspect-[2/3] w-full rounded-[32px]"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            ))
          ) : (
            <>
              {allBooks.map((book, index) => (
                <BookCard key={`${book.id}-${index}`} book={book} />
              ))}
              
              {/* INFINITE SCROLL LOADER */}
              <div ref={ref} className="col-span-full flex flex-col justify-center items-center p-16 mt-10 border-t border-dashed border-base-300">
                {isFetchingNextPage ? (
                  <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Buscando tesouros...</span>
                  </div>
                ) : hasNextPage ? (
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <span className="text-3xl">📚</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-base-content">Fim da estante alcançado</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* FLOATING ACTION BUTTON */}
      {showScrollButton && (
        <button 
          onClick={scrollToTop}
          className="btn btn-primary btn-circle fixed bottom-8 right-8 h-16 w-16 shadow-2xl z-50 animate-in zoom-in-50 duration-300"
        >
          <ArrowUp size={28} className="text-white" />
        </button>
      )}
    </div>
  );
}