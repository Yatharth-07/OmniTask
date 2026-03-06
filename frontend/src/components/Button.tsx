import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-900 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm border border-transparent',
        secondary: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-slate-500 shadow-sm',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm border border-transparent',
        ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 focus:ring-slate-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2',
    };

    return (
        <button
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
};
