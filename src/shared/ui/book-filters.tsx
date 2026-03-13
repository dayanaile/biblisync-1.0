import { useForm } from '@tanstack/react-form';
import { useFilterStore } from '../lib/store/use-filter-store';
import { Button } from './button';
import { Filter, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from './dropdown-menu';

export function BookFilters() {
  const { printType, orderBy, setFilters } = useFilterStore();

  const form = useForm({
    defaultValues: { 
      printType: printType as "all" | "books" | "magazines", 
      orderBy: orderBy as "relevance" | "newest" 
    },
    onSubmit: ({ value }) => setFilters(value),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-2xl gap-2 border-border/40">
          <Filter size={16} /> Filtros <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-4 rounded-3xl bg-white dark:bg-card shadow-2xl border-border/40">
        <DropdownMenuLabel className="px-0 mb-4 text-xs uppercase tracking-widest text-muted-foreground">
          Preferências
        </DropdownMenuLabel>
        
        <div className="space-y-4">
          <form.Field name="printType">
            {(field) => (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold">Tipo</span>
                <select 
                  value={field.state.value}
                  onChange={(e) => {
                      const value = e.target.value as any;
                      field.handleChange(value);
                      setFilters({ printType: value });
                  }}
                  className="bg-muted p-2 rounded-xl text-sm outline-none border-none ring-0"
                >
                  <option value="all">Todos</option>
                  <option value="books">Livros</option>
                  <option value="magazines">Revistas</option>
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="orderBy">
            {(field) => (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold">Ordenar por</span>
                <select 
                  value={field.state.value}
                  onChange={(e) => {
                      const value = e.target.value as any;
                      field.handleChange(value);
                      setFilters({ orderBy: value });
                  }}
                  className="bg-muted p-2 rounded-xl text-sm outline-none border-none ring-0"
                >
                  <option value="relevance">Relevância</option>
                  <option value="newest">Mais recentes</option>
                </select>
              </div>
            )}
          </form.Field>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}