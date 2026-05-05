import React from 'react';
import type { AttractionCategory } from '../../types';
import './AttractionFilters.css';

interface AttractionFiltersProps {
    categories: AttractionCategory[];
    onFilterChange: (filters: Record<string, any>) => void;
    currentFilters: Record<string, any>;
}

export const AttractionFilters: React.FC<AttractionFiltersProps> = ({ 
    categories, 
    onFilterChange, 
    currentFilters 
}) => {
    const handleClearAll = () => {
        onFilterChange({ 
            category: undefined, 
            page: 1 
        });
    };

    return (
        <div className="filter-container">
            {/* CATEGORIES SECTION */}
            <div className="filter-block">
                <h3 className="filter-heading">CATEGORIES</h3>
                <div className="filter-list">
                    <label className={`filter-card-item ${!currentFilters.category ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="category"
                            checked={!currentFilters.category}
                            onChange={() => onFilterChange({ category: undefined, page: 1 })}
                            className="hidden-radio"
                        />
                        <div className="custom-radio"></div>
                        <span className="filter-label-text">All Categories</span>
                    </label>
                    
                    {categories.map(cat => (
                        <label key={cat.id} className={`filter-card-item ${currentFilters.category === cat.id ? 'active' : ''}`}>
                            <input 
                                type="radio" 
                                name="category"
                                checked={currentFilters.category === cat.id}
                                onChange={() => onFilterChange({ category: cat.id, page: 1 })}
                                className="hidden-radio"
                            />
                            <div className="custom-radio"></div>
                            <span className="filter-label-text">{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {currentFilters.category && (
                <button onClick={handleClearAll} className="clear-filter-btn" style={{ marginTop: '20px', width: '100%' }}>
                    ✕ Clear Category Filter
                </button>
            )}
        </div>
    );
};