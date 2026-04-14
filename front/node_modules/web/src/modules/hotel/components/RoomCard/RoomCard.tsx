import React from 'react';
import type { IRoomType } from '../../types';
import { RoomReviewSection } from './RoomReviewSection';
import './RoomCard.css';

interface RoomCardProps {
    room: IRoomType;
    hotelId: string;
    onSelect?: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, hotelId, onSelect }) => {
    const imageUrl = room.images && room.images.length > 0
        ? room.images[0].url
        : 'https://placehold.co/400x300?text=Room+Image';

    return (
        <div className="room-card">
            {/* Image Section */}
            <div className="room-card-image">
                <img src={imageUrl} alt={room.name} />
            </div>

            {/* Details Section */}
            <div className="room-card-content">
                <div className="room-card-header">
                    <h3 className="room-card-title">{room.name}</h3>
                </div>

                {/* Description */}
                <p className="room-card-desc" title={room.description}>
                    {room.description || 'Enjoy a comfortable stay in our well-appointed room.'}
                </p>

                <div className="room-features">
                    {room.maxAdults > 0 && (
                        <div className="room-feature-item">
                            <span className="room-feature-label">Guests</span>
                            <span className="room-feature-value">
                                🧑 {room.maxAdults} Adults {room.maxChildren > 0 && `, 👶 ${room.maxChildren} Children`}
                            </span>
                        </div>
                    )}
                    {room.bedType && (
                        <div className="room-feature-item">
                            <span className="room-feature-label">Bed Type</span>
                            <span className="room-feature-value">🛏️ {room.bedType}</span>
                        </div>
                    )}
                    {room.roomSizeM2 && (
                        <div className="room-feature-item">
                            <span className="room-feature-label">Size</span>
                            <span className="room-feature-value">📐 {room.roomSizeM2} m²</span>
                        </div>
                    )}
                </div>

                {/* Amenities */}
                {room.roomAmenities && room.roomAmenities.length > 0 && (
                    <div className="room-amenities">
                        {room.roomAmenities.slice(0, 4).map(am => (
                            <span key={am.id} className="room-amenity-badge">
                                {am.amenityName}
                            </span>
                        ))}
                        {room.roomAmenities.length > 4 && (
                            <span className="room-amenity-extra">
                                +{room.roomAmenities.length - 4} more
                            </span>
                        )}
                    </div>
                )}

                {/* Price & Action */}
                <div className="room-card-footer">
                    <div>
                        {room.totalInventory - (room.baseOccupancy || 0) < 3 ? (
                            <span className="room-inventory-warning">
                                Only a few rooms left!
                            </span>
                        ) : (
                            <span className="room-inventory-normal">
                                Inventory: {room.totalInventory}
                            </span>
                        )}

                    </div>

                    <div className="room-action-area">
                        {room.basePrice ? (
                            <div className="room-price">₼{room.basePrice} <span>/ night</span></div>
                        ) : (
                            <div className="room-price" style={{ fontSize: '1rem' }}>Rates upon request</div>
                        )}
                        <button
                            onClick={() => onSelect && onSelect(room.id)}
                            className="btn-primary"
                        >
                            Rezervasiya
                        </button>
                    </div>
                </div>

                {/* Room Reviews Integration */}
                <RoomReviewSection hotelId={hotelId} roomId={room.id} />
            </div>
        </div>
    );
};
