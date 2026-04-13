import { Link, useNavigate } from 'react-router-dom';
import { 
    Plus, 
    MapPin, 
    Clock, 
    PencilLine, 
    Trash2, 
    Image as ImageIcon,
    Compass,
    Users,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { useTours } from '../hooks/useTours';
import type { ITour } from '../types';
import './VendorTourDashboard.css';

const ImageSlider = ({ images, name }: { images: string[], name: string }) => {
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

    return (
        <div className="tour-image-slider">
            <img src={images[currentIndex]} alt={`${name} - ${currentIndex + 1}`} />
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

export default function VendorTourDashboard() {
    const { data: tours, loading, error, removeTour } = useTours(true);
    const navigate = useNavigate();

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await removeTour(id);
            } catch (err) {
                alert('Failed to delete tour.');
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>My Tours</h1>
                    <p>Manage your experience listings and itineraries</p>
                </div>
                <Link to="/tours/create" className="btn-primary">
                    <Plus size={18} /> Create New Tour
                </Link>
            </div>

            {error && <div className="alert error">{error}</div>}

            <div className="dashboard-content">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your tours...</p>
                    </div>
                ) : tours.length === 0 ? (
                    <div className="empty-state">
                        <Compass size={48} className="empty-icon" />
                        <h3>No Tours Found</h3>
                        <p>You haven't created any tours yet. Share the beauty of Karabakh with the world.</p>
                        <Link to="/tours/create" className="btn-secondary">
                            Create Your First Tour
                        </Link>
                    </div>
                ) : (
                    <div className="tour-grid">
                        {tours.map((tour: ITour) => (
                            <div key={tour.id} className="tour-card-vendor">
                                <div className="tour-card-header">
                                    <span className="difficulty-badge" data-difficulty={tour.difficulty}>
                                        {tour.difficulty}
                                    </span>
                                </div>

                                <ImageSlider images={tour.images || []} name={tour.name} />

                                <div className="tour-card-body">
                                    <h3 title={tour.name}>{tour.name}</h3>
                                    
                                    <div className="tour-meta">
                                        <div className="meta-item">
                                            <Clock size={16} />
                                            <span>{tour.durationDays}d / {tour.durationNights}n</span>
                                        </div>
                                        <div className="meta-item">
                                            <Users size={16} />
                                            <span>{tour.groupSizeMin}-{tour.groupSizeMax} pax</span>
                                        </div>
                                    </div>

                                    <div className="tour-info">
                                        <MapPin size={16} />
                                        <span>{tour.city ? `${tour.city}, ` : ''}{tour.address}</span>
                                    </div>

                                    <div className="tour-price-row">
                                        <span className="price-label">Price per person</span>
                                        <span className="price-value">₼{tour.pricePerPerson}</span>
                                    </div>

                                    <div className="card-actions">
                                        <button 
                                            className="btn-secondary outline"
                                            onClick={() => navigate(`/tours/edit/${tour.id}`)}
                                        >
                                            <PencilLine size={16} /> Edit
                                        </button>
                                        <button 
                                            className="btn-delete-prop"
                                            onClick={() => handleDelete(tour.id, tour.name)}
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
