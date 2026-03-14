import { useFilterStore } from "../../../shared/lib/store/use-filter-store";

const genres = [
    "Todos",
    "Fantasia",
    "Ficção Científica",
    "Romance",
    "Mistério",
    "Terror",
    "Aventura",
    "Histórico",
    "Biografia",
    "Infantil",
    "Juvenil",
];

export function GenreNav() {
    const { selectedGenre, setGenre } = useFilterStore();
    
    return (
        <div className="w-full bg-base-100/80 backdrop-blur-md sticky top-0 z-30 border-b border-base-200">

            <div className="max-w-[1400px] mx-auto overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-3 p-4 px-6 md:px-12 w-max">
                    {genres.map((genre) => {
                        const isActive = selectedGenre === genre;
                        
                        return (
                            <button
                                key={genre}
                                onClick={() => setGenre(genre)}
                                className={`
                                    btn btn-sm rounded-full px-6 normal-case font-bold transition-all duration-300
                                    ${isActive 
                                        ? "btn-primary text-white shadow-lg shadow-primary/20 scale-105" 
                                        : "btn-ghost bg-base-200/50 hover:bg-primary/10 hover:text-primary border-none"
                                    }
                                `}
                            >
                                {genre}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}