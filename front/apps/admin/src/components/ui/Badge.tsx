import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    className?: string;
    dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'neutral',
    className = '',
    dot = false
}) => {
    const variants = {
        success: 'bg-emerald-50 text-emerald-700 border-emerald-100/50',
        warning: 'bg-amber-50 text-amber-700 border-amber-100/50',
        error: 'bg-rose-50 text-rose-700 border-rose-100/50',
        info: 'bg-indigo-50 text-indigo-700 border-indigo-100/50',
        neutral: 'bg-slate-50 text-slate-600 border-slate-100/50',
    };

    const dotColors = {
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        error: 'bg-rose-500',
        info: 'bg-indigo-500',
        neutral: 'bg-slate-400',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${variants[variant]} ${className}`}>
            {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}></span>}
            {children}
        </span>
    );
};

export default Badge;
