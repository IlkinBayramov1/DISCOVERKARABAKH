import React from 'react';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    extra?: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    title,
    description,
    extra,
    className = '',
    noPadding = false
}) => {
    return (
        <div className={`bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-gray-200/40 ${className}`}>
            {(title || extra) && (
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div>
                        {title && <h3 className="text-base font-bold text-slate-800">{title}</h3>}
                        {description && <p className="text-[12px] text-slate-400 mt-0.5 font-medium">{description}</p>}
                    </div>
                    {extra && <div className="flex-shrink-0">{extra}</div>}
                </div>
            )}
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>
        </div>
    );
};

export default Card;
