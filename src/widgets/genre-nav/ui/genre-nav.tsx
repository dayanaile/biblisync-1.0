import { useFilterStore } from "../../../shared/lib/store/use-filter-store";
import { Button } from "../../../shared/ui/button";
import { cn } from "../../../shared/lib/utils";
import { ScrollArea, ScrollBar } from "../../../shared/ui/scroll-area";

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
        <div className="w-full border-b bg-white dark:bg-secondary backdrop-blur-sm border-transparent">
            <ScrollArea className="w-full">
                <div className="flex space-x-2 p-4">
                    {genres.map((genre) => (
                        <Button
                            key={genre}
                            variant={selectedGenre === genre ? "default" : "outline"}
                            onClick={() => setGenre(genre)}
                            className={cn(
                                "border-none px-6 flex-shrink-0",
                                selectedGenre === genre && "bg-accent text-white hover:bg-accent/90"
                                    ? "bg-accent text-white hover:bg-accent/90 border-transparent shadow-md"
                                    : "hover:border-accent/50 hover:bg-accent/10"
                            )}
                        >
                            {genre}
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}