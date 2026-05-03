import React from 'react';
import type { AttractionCategory } from '../../types';
import './AttractionFilters.css';

interface AttractionFiltersProps {
    categories: AttractionCategory[];
    onFilterChange: (filters: Record<string, any>) => void;
    currentFilters: Record<string, any>;
}

const CITIES = [
    'Shusha', 'Lachin', 'Khankendi', 'Aghdam', 'Fuzuli', 
    'Kalbajar', 'Zangilan', 'Gubadly', 'Jabrayil', 'Khojaly', 'Khojavend'
];

export const AttractionFilters: React.FC<AttractionFiltersProps> = ({ 
    categories, 
    onFilterChange, 
    currentFilters 
}) => {
    const handleClearAll = () => {
        onFilterChange({ 
            category: undefined, 
            city: undefined,
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

            {/* LOCATIONS SECTION */}
            <div className="filter-block" style={{ marginTop: '30px' }}>
                <h3 className="filter-heading">LOCATIONS</h3>
                <div className="filter-list">
                    <label className={`filter-card-item ${!currentFilters.city ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="city"
                            checked={!currentFilters.city}
                            onChange={() => onFilterChange({ city: undefined, page: 1 })}
                            className="hidden-radio"
                        />
                        <div className="custom-radio"></div>
                        <span className="filter-label-text">All Cities</span>
                    </label>

                    {CITIES.map(city => (
                        <label key={city} className={`filter-card-item ${currentFilters.city === city ? 'active' : ''}`}>
                            <input 
                                type="radio" 
                                name="city"
                                checked={currentFilters.city === city}
                                onChange={() => onFilterChange({ city, page: 1 })}
                                className="hidden-radio"
                            />
                            <div className="custom-radio"></div>
                            <span className="filter-label-text">{city}</span>
                        </label>
                    ))}
                </div>
            </div>

            {(currentFilters.category || currentFilters.city) && (
                <button onClick={handleClearAll} className="clear-filter-btn" style={{ marginTop: '20px', width: '100%' }}>
                    ✕ Clear All Filters
                </button>
            )}
        </div>
    );
};