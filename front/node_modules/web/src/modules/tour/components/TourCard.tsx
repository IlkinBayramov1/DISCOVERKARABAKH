import React from 'react';
import type { ITour } from '../types';
import './TourCard.css';

interface TourCardProps {
    tour: ITour;
    onClick?: (id: string) => void;
}

export const TourCard: React.FC<TourCardProps> = ({ tour, onClick }) => {


    return (
        <div className="tour-card cursor-pointer" onClick={() => onClick && onClick(tour.id)}>
            <div className="tour-card-image overflow-x-auto flex snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {tour.images && tour.images.length > 0 ? (
                    tour.images.map((img, idx) => (
                        <div key={idx} className="w-full flex-shrink-0 snap-center relative h-full">
                            <img src={img} alt={`${tour.name} ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))
                ) : (
                    <div className="w-full flex-shrink-0 snap-center relative h-full">
                        <img src="https://placehold.co/400x300?text=No+Image" alt="No Image Available" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="tour-card-header absolute top-0 left-0 w-full z-10 pointer-events-none">
                    <h3 className="tour-card-title pointer-events-auto" title={tour.name}>{tour.name}</h3>
                </div>
                <div className="tour-card-badge absolute top-4 right-4 z-10 pointer-events-none">
                    {tour.durationDays}d / {tour.durationNights}n
                </div>
            </div>

            <div className="tour-card-details">
                <p className="tour-card-description">
                    {tour.description.length > 100 ? `${tour.description.substring(0, 100)}...` : tour.description}
                </p>

                <div className="tour-card-footer">
                    <div className="tour-card-group-size">
                        👥 {tour.groupSizeMin}-{tour.groupSizeMax} people
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
