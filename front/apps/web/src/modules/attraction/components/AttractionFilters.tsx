import React, { useState } from 'react';
import type { AttractionCategory } from '../types';
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
    const [search, setSearch] = useState(currentFilters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ search });
    };

    const toggleCategory = (categoryId: string) => {
        const newCategoryId = currentFilters.categoryId === categoryId ? undefined : categoryId;
        onFilterChange({ categoryId: newCategoryId });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ sort: e.target.value });
    };

    return (
        <div className="attraction-filters">
            <form onSubmit={handleSearch} className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search attractions..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">🔍</button>
            </form>

            <div className="filter-group">
                <h4>Categories</h4>
                <div className="category-pills">
                    <button 
                        className={`pill ${!currentFilters.categoryId ? 'active' : ''}`}
                        onClick={() => onFilterChange({ categoryId: undefined })}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            className={`pill ${currentFilters.categoryId === cat.id ? 'active' : ''}`}
                            onClick={() => toggleCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <h4>Sort By</h4>
                <select value={currentFilters.sort || 'popular'} onChange={handleSortChange}>
                    <option value="popular">Most Popular</option>
                    <option value="rating_desc">Highest Rated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest Additions</option>
                </select>
            </div>
        </div>
    );
};
