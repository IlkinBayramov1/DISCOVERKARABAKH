import React from 'react';
import { AttractionCard } from '../AttractionCard/AttractionCard';
import type { Attraction } from '../../types';
import './AttractionList.css';

interface AttractionListProps {
    attractions: Attraction[];
    isLoading?: boolean;
    error?: string | null;
}

export const AttractionList: React.FC<AttractionListProps> = ({ attractions, isLoading, error }) => {
    
    // ERROR STATE
    if (error) {
        return (
            <div className="error-premium">
                <span>{error}</span>
            </div>
        );
    }

    // EMPTY STATE
    if (!isLoading && attractions.length === 0) {
        return (
            <div className="empty-state-premium">
                <h3 className="empty-title">No attractions found</h3>
                <p className="empty-text">Try adjusting your search criteria or clear some filters.</p>
            </div>
        );
    }

    return (
        <section className="tour-grid">
            {isLoading ? (
                // SKELETON LOADER
                [1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton-tour"></div>)
            ) : (
                attractions.map((attraction) => (
                    <AttractionCard key={attraction.id} attraction={attraction} />
                ))
            )}
        </section>
    );
};