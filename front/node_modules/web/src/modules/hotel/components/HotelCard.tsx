import React from 'react';
import type { IHotel } from '../types';
import './HotelCard.css';

interface HotelCardProps {
    hotel: IHotel;
    onClick?: (id: string) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
    const imageUrl = hotel.images && hotel.images.length > 0 ? hotel.images[0].url : 'https://placehold.co/400x300?text=No+Image';

    return (
        <div className="hotel-card cursor-pointer" onClick={() => onClick && onClick(hotel.id)}>
            <div className="hotel-card-image">
                <img src={imageUrl} alt={hotel.name} />
            </div>

            <div className="hotel-card-details">
                <div className="hotel-card-header">
                    <h3 className="hotel-card-title" title={hotel.name}>{hotel.name}</h3>
                    {hotel.starRating && (
                        <div className="hotel-card-rating">
                            ★ <span>{hotel.starRating}</span>
                        </div>
                    )}
                </div>

                <a 
                    className="hotel-card-address hover:text-blue-600 hover:underline block" 
                    title={hotel.address}
                    href={hotel.latitude && hotel.longitude ? `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.city}, ${hotel.address}`)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                >
                    {hotel.city ? `${hotel.city}, ` : ''}{hotel.address}
                </a>

                <div className="hotel-card-footer">
                    <div>
                        {hotel.rating && hotel.rating > 0 ? (
                            <div className="hotel-review-score">
                                {hotel.rating.toFixed(1)}
                            </div>
                        ) : (
                            <span className="hotel-no-review">No reviews</span>
                        )}
                    </div>
                    {hotel.lowestPrice && (
                        <div className="hotel-price-info">
                            <span className="hotel-price-label">From</span>
                            <div className="hotel-price-val">₼{hotel.lowestPrice}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
