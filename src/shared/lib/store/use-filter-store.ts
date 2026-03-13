import { create } from 'zustand';

interface FilterState {
  selectedGenre: string;
  printType: 'all' | 'books' | 'magazines';
  orderBy: 'relevance' | 'newest';
  setGenre: (genre: string) => void;
  setFilters: (filters: Partial<Pick<FilterState, 'printType' | 'orderBy'>>) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedGenre: 'Todos',
  printType: 'all',
  orderBy: 'relevance',
  setGenre: (genre) => set({ selectedGenre: genre }),
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
}));