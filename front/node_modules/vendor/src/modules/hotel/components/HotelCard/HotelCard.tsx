import React, { useState } from 'react';
import { 
    MapPin, 
    Star, 
    BedDouble, 
    PencilLine, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { IHotel } from '../../types';

import './HotelCard.css';

interface HotelCardProps {
    hotel: IHotel;
    onDelete: (id: string, name: string) => void;
}

const ImageSlider = ({ images, name }: { images: any[], name: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="hotel-no-image-placeholder">
                <ImageIcon size={32} />
            </div>
        );
    }

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
    };

    const currentImage = images[currentIndex].url || images[currentIndex];

    return (
        <div className="hotel-image-slider">
            <img src={currentImage} alt={`${name} - ${currentIndex + 1}`} />
            {images.length > 1 && (
                <>
                    <button className="slider-btn prev" onClick={handlePrevious}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="slider-btn next" onClick={handleNext}>
                        <ChevronRight size={20} />
                    </button>
                    <div className="slider-dots">
                        {images.map((_, idx) => (
                            <span key={idx} className={`dot ${idx === currentIndex ? 'active' : ''}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onDelete }) => {
    const navigate = useNavigate();

    const mapsUrl = (hotel.latitude && hotel.longitude)
        ? `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`;

    return (
        <div className="hotel-card relative group">
            <div className="hotel-card-header">
                <span className={`status-badge ${hotel.status}`}>{hotel.status}</span>
                {hotel.isFeatured && (
                    <span className="featured-badge bg-amber-400 text-amber-900">
                        <Star size={12} /> FEATURED
                    </span>
                )}
            </div>

            <ImageSlider images={hotel.images || []} name={hotel.name} />

            <div className="hotel-card-body">
                <div className="title-row">
                    <h3>{hotel.name}</h3>
                    <div className="review-summary">
                        <Star size={14} fill="currentColor" />
                        <span>{hotel.rating ? hotel.rating.toFixed(1) : 'NEW'}</span>
                    </div>
                </div>

                <a 
                    href={mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hotel-info address-link"
                    title="Open in Google Maps"
                >
                    <MapPin size={16} className="text-slate-400 group-hover:text-blue-500" />
                    <span className="truncate">{hotel.city}, {hotel.address}</span>
                </a>

                <div className="hotel-info">
                    <BedDouble size={16} className="text-slate-400" />
                    <span className="capitalize">{hotel.propertyType}</span>
                </div>

                <div className="card-actions">
                    <button
                        className="btn-secondary"
                        onClick={() => navigate(`/rooms?hotelId=${hotel.id}`)}
                    >
                        <BedDouble size={16} /> Manage
                    </button>
                    <button
                        className="btn-secondary outline"
                        onClick={() => navigate(`/hotel/edit/${hotel.id}`)}
                    >
                        <PencilLine size={16} /> Edit
                    </button>
                    <button
                        className="btn-delete-prop"
                        onClick={() => onDelete(hotel.id, hotel.name)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
