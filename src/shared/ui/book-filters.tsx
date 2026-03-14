import { useForm } from '@tanstack/react-form';
import { useFilterStore } from '../lib/store/use-filter-store';
import { Filter, ChevronDown, ListFilter, SortDesc } from 'lucide-react';

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
    <div className="dropdown dropdown-end">
      {/* TRIGGER DO FILTRO */}
      <label 
        tabIndex={0} 
        className="btn btn-outline border-base-300 hover:bg-base-200 hover:text-base-content rounded-2xl gap-2 normal-case font-bold"
      >
        <Filter size={18} className="text-primary" /> 
        Filtros 
        <ChevronDown size={14} className="opacity-50" />
      </label>

      {/* PAINEL DE FILTROS */}
      <div 
        tabIndex={0} 
        className="dropdown-content z-[60] mt-3 p-6 shadow-2xl bg-base-100 border border-base-200 rounded-[32px] w-72"
      >
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Preferências</h3>
            <div className="h-1 w-8 bg-primary rounded-full" />
          </header>
          
          <div className="space-y-5">
            {/* TIPO DE MÍDIA */}
            <form.Field name="printType">
              {(field) => (
                <div className="form-control w-full">
                  <label className="label py-1 gap-2 justify-start">
                    <ListFilter size={14} className="text-primary" />
                    <span className="label-text font-bold text-xs">Tipo</span>
                  </label>
                  <select 
                    value={field.state.value}
                    onChange={(e) => {
                        const value = e.target.value as any;
                        field.handleChange(value);
                        setFilters({ printType: value });
                    }}
                    className="select select-bordered select-sm w-full rounded-xl bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  >
                    <option value="all">Todos os itens</option>
                    <option value="books">Livros</option>
                    <option value="magazines">Revistas</option>
                  </select>
                </div>
              )}
            </form.Field>

            {/* ORDENAÇÃO */}
            <form.Field name="orderBy">
              {(field) => (
                <div className="form-control w-full">
                  <label className="label py-1 gap-2 justify-start">
                    <SortDesc size={14} className="text-primary" />
                    <span className="label-text font-bold text-xs">Ordenar por</span>
                  </label>
                  <select 
                    value={field.state.value}
                    onChange={(e) => {
                        const value = e.target.value as any;
                        field.handleChange(value);
                        setFilters({ orderBy: value });
                    }}
                    className="select select-bordered select-sm w-full rounded-xl bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  >
                    <option value="relevance">Relevância</option>
                    <option value="newest">Mais recentes</option>
                  </select>
                </div>
              )}
            </form.Field>
          </div>

          <div className="divider my-0 opacity-50"></div>
          
          <p className="text-[9px] text-center opacity-40 font-bold uppercase tracking-widest">
            Ajustes aplicados em tempo real
          </p>
        </div>
      </div>
    </div>
  );
}