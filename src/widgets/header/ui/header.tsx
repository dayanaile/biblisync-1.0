import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/ui/avatar";
import { useThemeStore } from "../../../shared/lib/store/use-theme-store";
import { Button } from "../../../shared/ui/button";
import { LibrarySearch } from "../../library-search/ui/library-search";
import { useAuthStore } from "../../../entities/user/model/use-auth-store";
import { useNavigate } from "@tanstack/react-router";
import { ThemeToggle } from "../../../shared/ui/theme-toggle";
import { 
    User,
    Sun,
    Moon,
    LogOut,
    Settings 
} from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator 
} from "../../../shared/ui/dropdown-menu";
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
        <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-secondary border-transparent px-4">
            <div className="container flex h-16 items-center justify-between gap-4">
                
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer" onClick={() => navigate({ to: '/' })}>
                    <img src={biblioLogo} alt="Logo" className="h-10 w-auto" />
                </div>

                <div className="flex-1 flex justify-center px-10 h-10">
                    <LibrarySearch 
                        className="mb-0 max-w-none shadow-none h-10 rounded-lg bg-white dark:bg-card"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle/>
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="relative h-10 w-10 rounded-full border-2 border-secondary/20 hover:border-secondary transition-all">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt={user?.name}/>
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-64 p-2 mt-2 bg-white dark:bg-card border-border shadow-2xl rounded-2xl">
                                <DropdownMenuLabel className="font-normal p-4">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold leading-none">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/50"/>

                                <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer rounded-xl h-11">
                                    {theme === 'light' ? (
                                        <><Moon className="mr-2 h-4 w-4" /> <span>Modo Escuro</span></>
                                    ) : (
                                        <><Sun className="mr-2 h-4 w-4" /> <span>Modo Claro</span></>
                                    )}
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem className="cursor-pointer rounded-xl h-11">
                                    <Settings className="mr-2 h-4 w-4"/><span>Configurações</span>
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator className="bg-border/50"/>
                                
                                <DropdownMenuItem 
                                    onClick={handleLogout}
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-xl h-11 font-bold"
                                >
                                    <LogOut className="mr-2 h-4 w-4"/><span>Sair do BiblioSync</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button 
                            onClick={() => navigate({ to: '/login' })}
                            className="rounded-full px-8 bg-accent text-white hover:bg-secondary/90 shadow-lg shadow-secondary/20 transition-all active:scale-95"
                        >
                            Login
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}