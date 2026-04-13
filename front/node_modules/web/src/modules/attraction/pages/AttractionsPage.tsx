import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAttractions } from '../hooks/useAttractions';
import { AttractionList } from '../components/AttractionList';
import { AttractionFilters } from '../components/AttractionFilters';
import './AttractionsPage.css';

export const AttractionsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const city = searchParams.get('city') || '';

    const { 
        attractions, 
        categories, 
        isLoading, 
        error, 
        params, 
        updateFilters 
    } = useAttractions({ initialParams: { city: city || undefined } });

    React.useEffect(() => {
        const urlCity = searchParams.get('city') || undefined;
        if (urlCity !== params.city) {
            updateFilters({ city: urlCity });
        }
    }, [searchParams, params.city, updateFilters]);

    return (
        <div className="attractions-page">
            <div className="attractions-hero">
                <h1>Discover Karabakh Attractions</h1>
                <p>Explore the rich history, natural beauty, and cultural heritage of the region.</p>
            </div>

            <div className="attractions-container">
                <aside className="attractions-sidebar">
                    <AttractionFilters 
                        categories={categories}
                        currentFilters={params}
                        onFilterChange={updateFilters}
                    />
                </aside>
                
                <main className="attractions-main">
                    <div className="attractions-header">
                        <h2>{attractions.length} Attractions Found</h2>
                    </div>
                    
                    <AttractionList 
                        attractions={attractions} 
                        isLoading={isLoading} 
                        error={error} 
                    />
                </main>
            </div>
        </div>
    );
};
