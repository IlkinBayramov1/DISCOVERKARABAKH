import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        outline: 'bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    };

    const sizes = {
        sm: 'px-3.5 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-[14px]',
        lg: 'px-6 py-3.5 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Gözləyin...
                </div>
            ) : children}
        </button>
    );
};

export default Button;
