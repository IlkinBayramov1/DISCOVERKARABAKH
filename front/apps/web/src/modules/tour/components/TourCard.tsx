import React from 'react';
import type { ITour } from '../types';
import './TourCard.css';

interface TourCardProps {
    tour: ITour;
    onClick?: (id: string) => void;
}

export const TourCard: React.FC<TourCardProps> = ({ tour, onClick }) => {
    const imageUrl = tour.images && tour.images.length > 0 ? tour.images[0] : 'https://placehold.co/400x300?text=No+Image';

    return (
        <div className="tour-card cursor-pointer" onClick={() => onClick && onClick(tour.id)}>
            <div className="tour-card-image">
                <img src={imageUrl} alt={tour.name} />
                <div className="tour-card-badge">
                    {tour.duration.days}d / {tour.duration.nights}n
                </div>
            </div>

            <div className="tour-card-details">
                <div className="tour-card-header">
                    <h3 className="tour-card-title" title={tour.name}>{tour.name}</h3>
                    <div className="tour-card-difficulty" data-difficulty={tour.difficulty}>
                        {tour.difficulty}
                    </div>
                </div>

                <p className="tour-card-description">
                    {tour.description.length > 100 ? `${tour.description.substring(0, 100)}...` : tour.description}
                </p>

                <div className="tour-card-footer">
                    <div className="tour-card-group-size">
                        👥 {tour.groupSize.min}-{tour.groupSize.max} people
                    </div>
                    <div className="tour-card-price">
                        <span className="price-label">From</span>
                        <div className="price-val">₼{tour.pricePerPerson}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
