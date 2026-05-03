import React from 'react';
import type { TaxiSearchResult } from '../../api/transport.web.api';
import { FavoriteButton } from '../../../../shared/components/FavoriteButton/FavoriteButton';
import './PassengerTransportPage.css';

interface TransferCardProps {
    taxi: TaxiSearchResult;
    onClick: () => void;
    hasRoute: boolean; 
    isFavorited?: boolean;
}

export const TransferCard: React.FC<TransferCardProps> = ({ taxi, onClick, hasRoute, isFavorited }) => {
    const imageUrl = taxi.vehicle.images && taxi.vehicle.images.length > 0 
        ? taxi.vehicle.images[0] 
        : 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800'; 

    const category = taxi.vehicle.category || 'Standard';
    const isPremium = category.toLowerCase() === 'premium' || category.toLowerCase() === 'business';

    return (
        <div className="premium-card-ui" onClick={onClick}>
            <div className="card-image-section">
                <img src={imageUrl} alt={`${taxi.vehicle.brand} ${taxi.vehicle.model}`} loading="lazy" />
                
                <div className="card-category-badge">
                    <i className="fa-solid fa-car"></i>
                    <span>{category}</span>
                </div>
                
                <FavoriteButton 
                    targetId={taxi.vehicle.id} 
                    type="vehicle" 
                    initialIsFavorited={isFavorited} 
                />
            </div>

            <div className="card-info-section">
                <div className="card-header">
                    <h3 className="card-title" title={`${taxi.vehicle.brand} ${taxi.vehicle.model}`}>
                        {taxi.vehicle.brand} {taxi.vehicle.model}
                    </h3>
                </div>
                
                <div className="card-location">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>{isPremium ? 'Premium Service' : 'Verified Partner'} • {taxi.vehicle.vendorCompany}</span>
                </div>

                {taxi.vehicle.description && (
                    <p className="card-description" title={taxi.vehicle.description}>
                        {taxi.vehicle.description.length > 120 
                            ? `${taxi.vehicle.description.substring(0, 120)}...` 
                            : taxi.vehicle.description}
                    </p>
                )}

                <div className="card-amenities">
                    <div className="amenity-tag" title="Passenger Capacity">
                        <i className="fa-solid fa-user-group"></i>
                        <span>Up to {taxi.vehicle.seats} pax</span>
                    </div>
                    {taxi.vehicle.luggage > 0 && (
                        <div className="amenity-tag" title="Luggage Capacity">
                            <i className="fa-solid fa-suitcase"></i>
                            <span>{taxi.vehicle.luggage} Bags</span>
                        </div>
                    )}
                </div>

                <div className="card-footer">
                    <div className="price-wrapper">
                        <span className="price-meta">{hasRoute ? 'Estimated Fare' : 'Starting From'}</span>
                        <div className="price-main">
                            <span className="price-symbol">{taxi.pricing.currency || '₼'}</span>
                            <span className="price-amount">{taxi.pricing.totalPrice}</span>
                        </div>
                    </div>
                    <button className="card-action-btn">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};