import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    Plus,
    Building2,
    MapPin,
    Clock,
    Star,
    BedDouble,
    PencilLine,
    Trash2,
    Image as ImageIcon,
    TrendingUp,
    MousePointerClick,
    Eye,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useHotels } from '../../hooks/useHotels';
import type { IHotel } from '../../types';
import './HotelDashboard.css';

// Reusable Image Slider Component for the cards
const ImageSlider = ({ images, name }: { images: any[], name: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="no-image-placeholder">
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


export default function HotelDashboard() {
    const { data: hotels, loading, error, removeHotel } = useHotels(true);
    const navigate = useNavigate();

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
            try {
                await removeHotel(id);
            } catch (err) {
                alert('Failed to delete property.');
            }
        }
    };

    // Aggregate stats across all properties
    const aggregateStats = hotels.reduce(
        (acc, hotel: IHotel) => {
            if (hotel.dailyStats && hotel.dailyStats.length > 0) {
                // Summing up the most recent 7 days stats returned by the backend
                hotel.dailyStats.forEach(stat => {
                    acc.impressions += stat.impressions || 0;
                    acc.clicks += stat.clicks || 0;
                    acc.bookings += stat.totalBookings || 0;
                    acc.revenue += stat.totalRevenue || 0;
                });
            }
            return acc;
        },
        { impressions: 0, clicks: 0, bookings: 0, revenue: 0 }
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>My Hotels & Properties</h1>
                    <p>Manage your listings and live inventory</p>
                </div>
                <Link to="/vendor/hotel/create" className="btn-primary">
                    <Plus size={18} /> Add New Property
                </Link>
            </div>

            {error && <div className="alert error">{error}</div>}

            {/* KPI STATS CARDS */}
            {hotels.length > 0 && !loading && (
                <div className="kpi-grid">
                    <div className="kpi-card glassmorphism-card">
                        <div className="kpi-icon"><Eye size={24} /></div>
                        <div className="kpi-content">
                            <span className="kpi-label">Total Views (7d)</span>
                            <span className="kpi-value">{aggregateStats.impressions}</span>
                        </div>
                    </div>
                    <div className="kpi-card glassmorphism-card">
                        <div className="kpi-icon"><MousePointerClick size={24} /></div>
                        <div className="kpi-content">
                            <span className="kpi-label">Total Clicks (7d)</span>
                            <span className="kpi-value">{aggregateStats.clicks}</span>
                        </div>
                    </div>
                    <div className="kpi-card glassmorphism-card highlight">
                        <div className="kpi-icon"><TrendingUp size={24} /></div>
                        <div className="kpi-content">
                            <span className="kpi-label">Revenue (7d)</span>
                            <span className="kpi-value">{aggregateStats.revenue} AZN</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard-content">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your properties...</p>
                    </div>
                ) : hotels.length === 0 ? (
                    <div className="empty-state">
                        <Building2 size={48} className="empty-icon" />
                        <h3>No Properties Found</h3>
                        <p>You haven't listed any properties yet. Start your journey with us.</p>
                        <Link to="/vendor/hotel/create" className="btn-secondary">
                            List Your First Property
                        </Link>
                    </div>
                ) : (
                    <div className="hotel-grid">
                        {hotels.map((hotel: IHotel) => (
                            <div key={hotel.id} className="hotel-card">

                                <div className="hotel-card-header">
                                    <span className={`status-badge ${hotel.status}`}>{hotel.status}</span>
                                    {hotel.isFeatured && <span className="featured-badge"><Star size={12} /> Featured</span>}
                                </div>

                                <ImageSlider images={hotel.images || []} name={hotel.name} />

                                <div className="hotel-card-body">
                                    <div className="title-row">
                                        <h3>{hotel.name}</h3>
                                        <div className="review-summary" title={`${hotel.reviewCount || 0} Reviews`}>
                                            <Star size={14} className="star-icon" />
                                            <span>{hotel.rating ? hotel.rating.toFixed(1) : 'New'}</span>
                                            <span className="review-count">({hotel.reviewCount || 0})</span>
                                        </div>
                                    </div>

                                    <div className="hotel-info">
                                        <Building2 size={16} /> <span className="capitalize">{hotel.propertyType}</span>
                                    </div>

                                    <div className="hotel-info">
                                        <MapPin size={16} />
                                        {hotel.latitude && hotel.longitude ? (
                                            <a
                                                href={`https://maps.google.com/?q=${hotel.latitude},${hotel.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="map-link"
                                                title="View on Google Maps"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {hotel.address}
                                            </a>
                                        ) : (
                                            <span>{hotel.address}</span>
                                        )}
                                    </div>

                                    {(hotel.checkInTime || hotel.checkOutTime) && (
                                        <div className="hotel-info">
                                            <Clock size={16} /> <span>In: {hotel.checkInTime} - Out: {hotel.checkOutTime}</span>
                                        </div>
                                    )}

                                    <div className="card-actions">
                                        <button
                                            className="btn-secondary"
                                            onClick={() => navigate(`/vendor/rooms?hotelId=${hotel.id}`)}
                                        >
                                            <BedDouble size={16} /> Manage Rooms
                                        </button>
                                        <button
                                            className="btn-secondary outline"
                                            onClick={() => navigate(`/vendor/hotel/edit/${hotel.id}`)}
                                        >
                                            <PencilLine size={16} /> Edit
                                        </button>
                                        <button
                                            className="btn-delete-prop"
                                            onClick={() => handleDelete(hotel.id, hotel.name)}
                                            title="Delete Property"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
