import React from 'react';
import { AttractionCard } from './AttractionCard';
import type { Attraction } from '../types';
import './AttractionList.css';

interface AttractionListProps {
    attractions: Attraction[];
    isLoading?: boolean;
    error?: string | null;
}

export const AttractionList: React.FC<AttractionListProps> = ({ attractions, isLoading, error }) => {
    if (error) {
        return (
            <div className="attraction-message error">
                <span className="icon">⚠️</span>
                <p>{error}</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="attraction-list-grid">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="attraction-card skeleton">
                        <div className="skeleton-img"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-title"></div>
                            <div className="skeleton-text line-1"></div>
                            <div className="skeleton-text line-2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (attractions.length === 0) {
        return (
            <div className="attraction-message empty">
                <span className="icon">🏛️</span>
                <p>No attractions found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="attraction-list-grid">
            {attractions.map(attraction => (
                <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
        </div>
    );
};
