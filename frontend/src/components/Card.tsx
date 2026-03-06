import { ReactNode } from 'react';

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
    return (
        <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
    return <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-800 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
    return <h3 className={`text-lg font-semibold text-slate-900 dark:text-slate-50 ${className}`}>{children}</h3>;
};

export const CardDescription = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
    return <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 ${className}`}>{children}</p>;
};

export const CardContent = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
    return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
    return <div className={`px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 ${className}`}>{children}</div>;
};
