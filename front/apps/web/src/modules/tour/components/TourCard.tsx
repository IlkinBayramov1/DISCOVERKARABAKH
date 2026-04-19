import React from 'react';
import type { ITour } from '../types';
import './TourCard.css';

interface TourCardProps {
    tour: ITour;
    onClick?: (id: string) => void;
}

export const TourCard: React.FC<TourCardProps> = ({ tour, onClick }) => {
    const imageUrl = tour.images && tour.images.length > 0 
        ? tour.images[0] 
        : 'https://placehold.co/400x300?text=No+Image';

    return (
        <div className="premium-tour-card" onClick={() => onClick && onClick(tour.id)}>
            <div className="card-image-section">
                <img src={imageUrl} alt={tour.name} loading="lazy" />
                
                <div className="card-duration-badge">
                    <i className="fa-regular fa-clock"></i>
                    <span>{tour.durationDays}D / {tour.durationNights}N</span>
                </div>
                
                <button className="wishlist-btn" onClick={(e) => e.stopPropagation()}>
                    <i className="fa-regular fa-heart"></i>
                </button>
            </div>

            <div className="card-info-section">
                <div className="card-header">
                    <h3 className="card-title" title={tour.name}>{tour.name}</h3>
                </div>
                
                <div className="card-location">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{tour.city || 'Karabakh'}, Azerbaijan</span>
                </div>

                {tour.description && (
                    <p className="card-description" title={tour.description}>
                        {tour.description.length > 120 
                            ? `${tour.description.substring(0, 120)}...` 
                            : tour.description}
                    </p>
                )}

                <div className="card-amenities">
                    {/* Difficulty tag removed here */}
                    <div className="amenity-tag" title="Group Size">
                        <i className="fa-solid fa-users"></i>
                        <span>{tour.groupSizeMin}-{tour.groupSizeMax} People</span>
                    </div>
                </div>

                <div className="card-footer">
                    <div className="price-wrapper">
                        <span className="price-meta">Starting from</span>
                        <div className="price-main">
                            <span className="price-symbol">₼</span>
                            <span className="price-amount">{tour.pricePerPerson}</span>
                            <span className="price-unit">/person</span>
                        </div>
                    </div>
                    <button className="card-action-btn">
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};