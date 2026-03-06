import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, UserSquare2 } from 'lucide-react';
import { Button } from '../components/Button';

export const MainLayout = () => {
    const { user, logout, isAdmin } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
            <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80">
                <div className="flex items-center justify-between h-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg hidden sm:inline-block text-slate-900 dark:text-slate-50">
                            OmniTask
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <UserSquare2 className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-slate-900 dark:text-slate-100 leading-none">
                                    {user?.role === 'admin' ? 'Administrator' : 'User'}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-none">
                                    ID: {user?.sub}
                                </span>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout} className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Outlet />
            </main>
        </div>
    );
};
