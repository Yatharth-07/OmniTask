import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
    type: AlertType;
    title?: string;
    message: string;
    className?: string;
}

const styles: Record<AlertType, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
    success: {
        bg: 'bg-green-50 dark:bg-green-500/10',
        border: 'border-green-200 dark:border-green-500/20',
        text: 'text-green-800 dark:text-green-400',
        icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />,
    },
    error: {
        bg: 'bg-red-50 dark:bg-red-500/10',
        border: 'border-red-200 dark:border-red-500/20',
        text: 'text-red-800 dark:text-red-400',
        icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-500" />,
    },
    warning: {
        bg: 'bg-yellow-50 dark:bg-yellow-500/10',
        border: 'border-yellow-200 dark:border-yellow-500/20',
        text: 'text-yellow-800 dark:text-yellow-400',
        icon: <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />,
    },
    info: {
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-200 dark:border-blue-500/20',
        text: 'text-blue-800 dark:text-blue-400',
        icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-500" />,
    },
};

export const Alert = ({ type, title, message, className = '' }: AlertProps) => {
    const s = styles[type];

    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${s.bg} ${s.border} ${className}`}>
            <div className="flex-shrink-0 mt-0.5">{s.icon}</div>
            <div>
                {title && <h3 className={`text-sm font-semibold mb-1 ${s.text}`}>{title}</h3>}
                <p className={`text-sm ${s.text} opacity-90`}>{message}</p>
            </div>
        </div>
    );
};
