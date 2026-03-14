import { useThemeStore } from "../../../shared/lib/store/use-theme-store";
import { LibrarySearch } from "../../library-search/ui/library-search";
import { useAuthStore } from "../../../entities/user/model/use-auth-store";
import { useNavigate } from "@tanstack/react-router";
import { ThemeToggle } from "../../../shared/ui/theme-toggle";
import { 
    User,
    Sun,
    Moon,
    LogOut,
    Settings,
    ChevronDown,
    BookOpenText
} from "lucide-react";
import biblioLogo from "../../../assets/biblioSync-logo.png";

export function Header() {
    const { theme, toggleTheme } = useThemeStore();
    const { user, logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate({ to: '/login' });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-base-100/80 backdrop-blur-md border-base-200 px-4">
            <div className="container mx-auto flex h-16 items-center justify-between gap-4">
                
                {/* LOGO */}
                <div 
                    className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95 shrink-0" 
                    onClick={() => navigate({ to: '/' })}
                >
                    <><BookOpenText size={20} /> <span>BiblioSync</span></>
                </div>

                {/* BUSCA CENTRALIZADA */}
                <div className="flex-1 max-w-xl hidden md:flex h-10">
                    <LibrarySearch 
                        className="mb-0 max-w-none shadow-none h-10 rounded-xl bg-base-200 focus-within:bg-base-100 transition-all border-transparent"
                    />
                </div>

                {/* AÇÕES DA DIREITA */}
                <div className="flex items-center gap-2 md:gap-4">
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <div className="dropdown dropdown-end">
                            {/* TRIGGER DO DROPDOWN */}
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-base-200 hover:border-primary transition-all p-0 overflow-hidden">
                                <div className="w-10 rounded-full">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                                        alt={user?.name || "User"} 
                                    />
                                </div>
                            </label>

                            {/* CONTEÚDO DO DROPDOWN */}
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-[24px] w-64 border border-base-200">
                                <div className="px-4 py-3 border-b border-base-200 mb-2">
                                    <p className="text-sm font-black uppercase tracking-tight text-base-content">{user?.name}</p>
                                    <p className="text-[10px] opacity-60 font-medium truncate">{user?.email}</p>
                                </div>
                                
                                <li>
                                    <button onClick={toggleTheme} className="h-11 rounded-xl gap-3">
                                        {theme === 'light' ? (
                                            <><Moon size={16} /> <span>Modo Escuro</span></>
                                        ) : (
                                            <><Sun size={16} /> <span>Modo Claro</span></>
                                        )}
                                    </button>
                                </li>
                                
                                <li>
                                    <button className="h-11 rounded-xl gap-3">
                                        <Settings size={16} /> <span>Configurações</span>
                                    </button>
                                </li>
                                
                                <div className="divider my-1 opacity-50"></div>
                                
                                <li>
                                    <button 
                                        onClick={handleLogout}
                                        className="h-11 rounded-xl gap-3 text-error font-bold hover:bg-error/10"
                                    >
                                        <LogOut size={16} /> <span>Sair do BiblioSync</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate({ to: '/login' })}
                            className="btn btn-primary btn-sm md:btn-md rounded-full px-8 text-white shadow-lg shadow-primary/20"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}