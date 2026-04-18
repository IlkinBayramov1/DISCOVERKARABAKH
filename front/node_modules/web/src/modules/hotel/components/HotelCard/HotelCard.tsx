import React from 'react';
import type { IHotel } from '../../types';
import './HotelCard.css';

interface HotelCardProps {
    hotel: IHotel;
    onClick?: (id: string) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
    const imageUrl = hotel.images && hotel.images.length > 0 
        ? hotel.images[0].url 
        : 'https://placehold.co/400x300?text=No+Image';

    const getAmenityConfig = (rawName?: string) => {
        if (!rawName) return { icon: 'fa-solid fa-check' };
        const lowerName = String(rawName).toLowerCase();
        if (lowerName.includes('wifi')) return { icon: 'fa-solid fa-wifi' };
        if (lowerName.includes('parking')) return { icon: 'fa-solid fa-square-parking' };
        if (lowerName.includes('spa')) return { icon: 'fa-solid fa-spa' };
        if (lowerName.includes('pool')) return { icon: 'fa-solid fa-person-swimming' };
        if (lowerName.includes('gym')) return { icon: 'fa-solid fa-dumbbell' };
        if (lowerName.includes('restaurant')) return { icon: 'fa-solid fa-utensils' };
        if (lowerName.includes('bar')) return { icon: 'fa-solid fa-martini-glass-citrus' };
        return { icon: 'fa-solid fa-circle-check' }; 
    };

    const getDisplayPrice = () => {
        const h = hotel as any;
        if (h.roomTypes && h.roomTypes.length > 0) {
            const prices = h.roomTypes.map((room: any) => room.basePrice).filter((p: any) => p != null);
            if (prices.length > 0) return Math.min(...prices);
        }
        return h.startingPrice || h.lowestPrice || '---';
    };

    const finalPrice = getDisplayPrice();

    return (
        <div className="premium-hotel-card" onClick={() => onClick && onClick(hotel.id)}>
            <div className="card-image-section">
                <img src={imageUrl} alt={hotel.name} loading="lazy" />
                {hotel.starRating && (
                    <div className="card-rating-badge">
                        <i className="fa-solid fa-star"></i>
                        <span>{hotel.starRating.toFixed(1)}</span>
                    </div>
                )}
                <button className="wishlist-btn" onClick={(e) => e.stopPropagation()}>
                    <i className="fa-regular fa-heart"></i>
                </button>
            </div>

            <div className="card-info-section">
                <div className="card-header">
                    <h3 className="card-title">{hotel.name}</h3>
                </div>
                
                <div className="card-location">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{hotel.city}, Azerbaijan</span>
                </div>

                <div className="card-amenities">
                    {hotel.amenities?.slice(0, 4).map((am: any) => {
                        const name = am?.name || am?.amenity?.name;
                        const config = getAmenityConfig(name);
                        return (
                            <div key={am.id || Math.random()} className="amenity-tag" title={name}>
                                <i className={config.icon}></i>
                                <span>{name}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="card-footer">
                    <div className="price-wrapper">
                        <span className="price-meta">Starting from</span>
                        <div className="price-main">
                            <span className="price-symbol">₼</span>
                            <span className="price-amount">{finalPrice}</span>
                            <span className="price-unit">/night</span>
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