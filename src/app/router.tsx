import { useThemeStore } from '../shared/lib/store/use-theme-store';
import { LibraryPage } from '../pages/library';
import { BookDetailsPage } from '../pages/book-details';
import { HomePage } from '../pages/home';
import { FavoritesPage } from '../pages/favorites';
import { LoginPage } from '../pages/login';
import { Header } from '../widgets/header/ui/header';
import { Sidebar } from '../widgets/sidebar/ui/sidebar';
import { GenreNav } from '../widgets/genre-nav/ui/genre-nav';
import { useLocation } from '@tanstack/react-router';
import { redirect, createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { useAuthStore } from '../entities/user/model/use-auth-store';
import { useEffect } from 'react';
import { Toaster } from '../shared/ui/toaster';

function RootComponent() {
    const { theme } = useThemeStore();

    useEffect(() => {
        const root = window.document.documentElement;
        theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    }, [theme]);

    return (
        <>
            <Outlet />
            <Toaster />
        </>
    )
}

const rootRoute = createRootRoute({ component: RootComponent });

const layoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'layout',
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
            throw redirect({ to: '/login' });
        }
    },
    component: () => {
        const location = useLocation();
        const isHomePage = location.pathname === '/';

        return (
            <div className='h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-hidden'>
                <Header />
                <div className='flex flex-1 overflow-hidden'>
                    <Sidebar />
                    <div className='flex flex-col flex-1 min-w-0 bg-background'>
                        {isHomePage && <GenreNav />}
                        <main className='flex-1 bg-card overflow-y-auto p-10'>
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        );
    }
});

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
});

const indexRoute = createRoute({
    getParentRoute: () => layoutRoute,
    path: '/',
    component: HomePage,
});

const libraryRoute = createRoute({ 
    getParentRoute: () => layoutRoute, 
    path: '/library', 
    component: LibraryPage, 
});

export const bookDetailsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/books/$bookId',
  component: BookDetailsPage,
});

const favoritesRoute = createRoute({ 
    getParentRoute: () => layoutRoute, 
    path: '/highlights', 
    component: FavoritesPage, 
});

const routeTree = rootRoute.addChildren([
    loginRoute, 
    layoutRoute.addChildren([
        indexRoute, 
        libraryRoute, 
        bookDetailsRoute, 
        favoritesRoute
    ])
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}