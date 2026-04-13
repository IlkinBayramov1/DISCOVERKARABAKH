import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Attraction } from '../types';
import './AttractionCard.css';

interface AttractionCardProps {
    attraction: Attraction;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
    const navigate = useNavigate();
    const defaultImage = 'https://images.unsplash.com/photo-1549558549-415fe4c37b60?auto=format&fit=crop&q=80&w=800';
    const coverImage = attraction.images?.find(img => img.isCover)?.url || attraction.images?.[0]?.url || defaultImage;

    return (
        <div 
            className="attraction-card" 
            onClick={() => navigate(`/attractions/${attraction.slug || attraction.id}`)}
        >
            <div className="attraction-card-image">
                <img src={coverImage} alt={attraction.name} />
                <div className="attraction-card-badges">
                    {attraction.isFeatured && <span className="badge featured">Premium</span>}
                    {attraction.category && <span className="badge category">{attraction.category.name}</span>}
                </div>
            </div>
            
            <div className="attraction-card-content">
                <div className="attraction-card-header">
                    <h3>{attraction.name}</h3>
                    {attraction.stats && attraction.stats.averageRating > 0 && (
                        <div className="rating">
                            ⭐ <span>{attraction.stats.averageRating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
                
                <p className="attraction-card-location">📍 {attraction.city || 'Karabakh'} • {attraction.address}</p>
                <p className="attraction-card-description">
                    {attraction.description.length > 100 
                        ? `${attraction.description.substring(0, 100)}...` 
                        : attraction.description}
                </p>
                
                <div className="attraction-card-footer">
                    <div className="price">
                        {attraction.entryType === 'free' ? (
                            <span className="free">Free Entry</span>
                        ) : (
                            <span>₼ {attraction.price} <span>/ person</span></span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
