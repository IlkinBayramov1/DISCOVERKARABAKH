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
    return (
        <div className="filter-block">
            <h3 className="filter-heading">CATEGORIES</h3>
            
            <div className="filter-list">
                {/* All Attractions (Tüm Görməli Yerlər) */}
                <label className={`filter-card-item ${!currentFilters.categoryId ? 'active' : ''}`}>
                    <input 
                        type="radio" 
                        name="categoryId"
                        checked={!currentFilters.categoryId}
                        onChange={() => onFilterChange({ categoryId: undefined })}
                        className="hidden-radio"
                    />
                    <div className="custom-radio"></div>
                    <span className="filter-label-text">All Attractions</span>
                </label>
                
                {/* Dinamik Kateqoriyalar */}
                {categories.map(cat => (
                    <label key={cat.id} className={`filter-card-item ${currentFilters.categoryId === cat.id ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="categoryId"
                            checked={currentFilters.categoryId === cat.id}
                            onChange={() => onFilterChange({ categoryId: cat.id })}
                            className="hidden-radio"
                        />
                        <div className="custom-radio"></div>
                        <span className="filter-label-text">{cat.name}</span>
                    </label>
                ))}
            </div>

            {/* Əgər hər hansı bir kateqoriya seçilibsə "Clear" düyməsini göstər */}
            {currentFilters.categoryId && (
                <button onClick={() => onFilterChange({ categoryId: undefined })} className="clear-filter-btn">
                    ✕ Clear Filter
                </button>
            )}
        </div>
    );
};