import { forwardRef, InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    id: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, id, className = '', ...props }, ref) => {
        return (
            <div className={`flex flex-col gap-1 w-full ${className}`}>
                <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
                <div className="relative">
                    <input
                        id={id}
                        ref={ref}
                        className={`
              w-full px-4 py-2 bg-white dark:bg-slate-800 
              border rounded-lg outline-none transition-all duration-200
              text-slate-900 dark:text-slate-100 placeholder:text-slate-400
              ${error
                                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30'
                                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30'
                            }
            `}
                        {...props}
                    />
                    {error && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                    )}
                </div>
                {error && <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
