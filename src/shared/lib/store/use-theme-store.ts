import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    theme: 'libris' | 'dark'; // Mudamos 'light' para 'libris'
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'libris', // Default agora é o seu tema customizado
            toggleTheme: () =>
                set((state) => {
                    const newTheme = state.theme === 'libris' ? 'dark' : 'libris';
                    const root = window.document.documentElement;

                    // O "pulo do gato": DaisyUI usa data-theme
                    root.setAttribute('data-theme', newTheme);
                    
                    // Mantemos o suporte para classes se você ainda usar utilitários dark: do Tailwind
                    if (newTheme === 'dark') {
                        root.classList.add('dark');
                    } else {
                        root.classList.remove('dark');
                    }

                    return { theme: newTheme };
                }),
        }),
        { 
            name: 'theme-storage',
            // Opcional: Garante que ao recarregar a página, o atributo seja reaplicado
            onRehydrateStorage: () => (state) => {
                if (state) {
                    document.documentElement.setAttribute('data-theme', state.theme);
                    if (state.theme === 'dark') document.documentElement.classList.add('dark');
                }
            }
        }
    )
)