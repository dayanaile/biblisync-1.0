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
import { Button } from "../../../shared/ui/button";
import { useAuthStore } from "../../../entities/user/model/use-auth-store";
import { useState, useEffect } from "react";

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

    const handleLibraryClick = () => {
        setIsLibraryOpen(!isLibraryOpen);
        navigate({ to: '/library', search: { status: undefined } });
    };

    return (
        <aside className="hidden md:flex w-64 border-r flex-col bg-white dark:bg-secondary border-transparent">
            <div className="flex-1 py-6 px-4 space-y-1">
                <Button variant="ghost" asChild className="w-full justify-start gap-3 hover:bg-input rounded-xl h-12 group">
                    <Link to="/" activeProps={{className: "bg-card text-secondary shadow-sm"}}>
                        <Home className="h-5 w-5 text-muted-foreground group-hover:text-secondary"/>
                        <span className="font-medium">Início</span>
                    </Link>
                </Button>

                <div className="space-y-1">
                    <Button 
                        variant="ghost" 
                        onClick={handleLibraryClick}
                        className="w-full justify-between gap-3 hover:bg-input rounded-xl h-12 group"
                    >
                        <div className="flex items-center gap-3">
                            <Library className={`h-5 w-5 transition-colors ${location.pathname.includes('library') ? 'text-secondary' : 'text-muted-foreground'} group-hover:text-secondary`}/>
                            <span className={`font-medium ${location.pathname.includes('library') ? 'text-secondary' : 'text-white'}`}>Biblioteca</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isLibraryOpen ? '' : '-rotate-90'}`} />
                    </Button>

                    {isLibraryOpen && (
                        <div className="pl-4 space-y-1">
                            {subMenuItems.map((sub) => (
                                <Button
                                    key={sub.label}
                                    variant="ghost"
                                    asChild
                                    className="w-full justify-start gap-3 hover:bg-input/50 rounded-xl h-10 group"
                                >
                                    <Link 
                                        to="/library" 
                                        search={{ status: sub.status }}
                                        activeProps={{className: "text-[#FCA72C] font-bold bg-[#FCA72C]/5"}}
                                        activeOptions={{ exact: true }}
                                    >
                                        <sub.icon className="h-4 w-4 text-muted-foreground group-hover:text-[#FCA72C]"/>
                                        <span className="text-sm">{sub.label}</span>
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                <Button variant="ghost" asChild className="w-full justify-start gap-3 hover:bg-input rounded-xl h-12 group">
                    <Link to="/highlights" activeProps={{className: "bg-card text-secondary shadow-sm"}}>
                        <Star className="h-5 w-5 text-muted-foreground group-hover:text-secondary"/>
                        <span className="font-medium">Favoritos</span>
                    </Link>
                </Button>
            </div>

            {isAuthenticated && (
                <div className="p-4 border-t border-border/40">
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:text-white hover:bg-destructive transition-all rounded-xl h-12"
                    >
                        <LogOut className="h-5 w-5"/>
                        <span className="font-medium">Sair da Conta</span>
                    </Button>
                </div>
            )}
        </aside>
    );
}