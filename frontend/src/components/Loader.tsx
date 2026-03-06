import { Loader2 } from 'lucide-react';

export const Loader = ({ className = '' }: { className?: string }) => {
    return (
        <div className={`flex items-center justify-center p-8 ${className}`}>
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
    );
};

export const FullPageLoader = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-950 z-50">
            <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-500 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">Loading Application...</p>
        </div>
    );
};
