import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Attraction } from '../../types';
import { FavoriteButton } from '../../../../shared/components/FavoriteButton/FavoriteButton';
import './AttractionCard.css';

interface AttractionCardProps {
    attraction: Attraction;
    isFavorited?: boolean;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, isFavorited }) => {
    const navigate = useNavigate();
    const defaultImage = 'https://images.unsplash.com/photo-1549558549-415fe4c37b60?auto=format&fit=crop&q=80&w=800';
    const coverImage = attraction.images?.find(img => img.isCover)?.url || attraction.images?.[0]?.url || defaultImage;

    return (
        <div className="premium-attraction-card" onClick={() => navigate(`/attractions/${attraction.slug || attraction.id}`)}>
            <div className="card-image-section">
                <img src={coverImage} alt={attraction.name} loading="lazy" />
                
                {attraction.category && (
                    <div className="card-duration-badge">
                        <span>{attraction.category.name}</span>
                    </div>
                )}
                
                <FavoriteButton 
                    targetId={attraction.id} 
                    type="attraction" 
                    initialIsFavorited={isFavorited} 
                />
            </div>

            <div className="card-info-section">
                <div className="card-header">
                    <h3 className="card-title" title={attraction.name}>{attraction.name}</h3>
                </div>
                
                <div className="card-location">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{attraction.city || 'Karabakh'}</span>
                </div>

                {attraction.description && (
                    <p className="card-description" title={attraction.description}>
                        {attraction.description.length > 120 
                            ? `${attraction.description.substring(0, 120)}...` 
                            : attraction.description}
                    </p>
                )}

                <div className="card-amenities">
                    {attraction.stats && attraction.stats.averageRating > 0 && (
                        <div className="amenity-tag" title="Rating">
                            <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i>
                            <span>{attraction.stats.averageRating.toFixed(1)} Rating</span>
                        </div>
                    )}
                </div>

                <div className="card-footer">
                    <div className="price-wrapper">
                        <span className="price-meta">Entry Ticket</span>
                        <div className="price-main">
                            {attraction.entryType === 'free' || !attraction.price ? (
                                <span className="price-amount" style={{ fontSize: '18px' }}>Free</span>
                            ) : (
                                <>
                                    <span className="price-symbol">₼</span>
                                    <span className="price-amount">{attraction.price}</span>
                                    <span className="price-unit">/person</span>
                                </>
                            )}
                        </div>
                    </div>
                    <button className="card-action-btn">
                        Explore
                    </button>
                </div>
            </div>
        </div>
    );
};