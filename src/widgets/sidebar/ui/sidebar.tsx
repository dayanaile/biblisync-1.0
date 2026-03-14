import {
    Home,
    Star,
    LogOut,
    Library,
    Clock,
    Play,
    CheckCircle2,
    ChevronDown,
    LayoutGrid
} from "lucide-react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "../../../entities/user/model/use-auth-store";
import { useState } from "react";

const subMenuItems = [
    { label: "Todos", icon: LayoutGrid, status: undefined },
    { label: "Quero Ler", icon: Clock, status: "WANT_TO_READ" },
    { label: "Lendo", icon: Play, status: "READING" },
    { label: "Concluído", icon: CheckCircle2, status: "COMPLETED" },
];

export function Sidebar() {
    const { logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLibraryOpen, setIsLibraryOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate({ to: '/login' });
    };

    return (
        <aside className="hidden md:flex w-64 border-r border-base-200 flex-col bg-base-100 shrink-0">
            <div className="flex-1 py-8 px-4">
                <ul className="menu menu-md w-full p-0 gap-2">
                    {/* INÍCIO */}
                    <li>
                        <Link 
                            to="/" 
                            activeProps={{ className: "active" }}
                            className="flex gap-4 font-bold rounded-xl h-12"
                        >
                            <Home size={20} />
                            <span>Início</span>
                        </Link>
                    </li>

                    {/* BIBLIOTECA COM SUBMENU */}
                    <li>
                        <details open={isLibraryOpen} onToggle={(e) => setIsLibraryOpen(e.currentTarget.open)}>
                            <summary className={`flex gap-4 font-bold rounded-xl h-12 ${location.pathname.includes('library') ? 'text-primary' : ''}`}>
                                <Library size={20} />
                                <span>Biblioteca</span>
                            </summary>
                            <ul className="mt-2 ml-4 gap-1 border-l-2 border-base-200">
                                {subMenuItems.map((sub) => (
                                    <li key={sub.label}>
                                        <Link 
                                            to="/library" 
                                            search={{ status: sub.status }}
                                            activeProps={{ className: "text-primary font-black bg-primary/5" }}
                                            className="flex gap-3 rounded-lg h-10 text-sm opacity-80 hover:opacity-100"
                                        >
                                            <sub.icon size={16} />
                                            {sub.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </li>

                    {/* FAVORITOS */}
                    <li>
                        <Link 
                            to="/highlights" // Ajustado para condizer com o seu arquivo anterior
                            activeProps={{ className: "active" }}
                            className="flex gap-4 font-bold rounded-xl h-12"
                        >
                            <Star size={20} />
                            <span>Favoritos</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* BOTÃO DE LOGOUT */}
            {isAuthenticated && (
                <div className="p-4 mt-auto border-t border-base-200">
                    <button
                        onClick={handleLogout}
                        className="btn btn-ghost w-full justify-start gap-4 text-error hover:bg-error/10 rounded-xl normal-case h-12"
                    >
                        <LogOut size={20} />
                        <span className="font-bold">Sair da Conta</span>
                    </button>
                </div>
            )}
        </aside>
    );
}