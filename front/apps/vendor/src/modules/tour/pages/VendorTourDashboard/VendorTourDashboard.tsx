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
    ChevronRight,
    RefreshCw,
    CheckCircle
} from 'lucide-react';
import { useState } from 'react';
import { useTours } from '../../hooks/useTours';
import type { ITour } from '../../types';
import './VendorTourDashboard.css';

const ImageSlider = ({ images, name }: { images: string[], name: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="dk-slider-empty">
                <ImageIcon size={48} className="text-slate-300" />
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
        <div className="dk-image-slider">
            <img src={images[currentIndex]} alt={`${name} - ${currentIndex + 1}`} className="dk-slider-img" />
            {images.length > 1 && (
                <>
                    <button className="dk-slider-btn prev" onClick={handlePrevious}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="dk-slider-btn next" onClick={handleNext}>
                        <ChevronRight size={20} />
                    </button>
                    <div className="dk-slider-dots">
                        {images.map((_, idx) => (
                            <span key={idx} className={`dk-dot ${idx === currentIndex ? 'active' : ''}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default function VendorTourDashboard() {
    const { data: tours, loading, error, removeTour, pagination, refetch } = useTours(true);
    const navigate = useNavigate();

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Warning: Are you absolutely sure you want to delete "${name}"? This action cannot be undone.`)) {
            try {
                await removeTour(id);
            } catch (err) {
                alert('Failed to delete tour.');
            }
        }
    };

    return (
        <div className="dk-tour-dash-layout">
            
            {/* HEADER */}
            <div className="dk-tour-dash-header">
                <div>
                    <h1 className="dk-td-title">Experiences & Tours</h1>
                    <p className="dk-td-subtitle">Manage your active tour blueprints, pricing, and availability.</p>
                </div>
                <div className="dk-td-actions">
                    <button className="dk-btn-refresh" onClick={() => refetch()} title="Refresh Data">
                        <RefreshCw size={18} className={loading ? 'spin-icon' : ''} />
                    </button>
                    <Link to="/tours/create" className="dk-btn-primary">
                        <Plus size={18} /> New Tour
                    </Link>
                </div>
            </div>

            {error && <div className="dk-alert-error mb-6">{error}</div>}

            {/* CONTENT */}
            <div className="dk-tour-dash-content">
                {loading ? (
                    <div className="dk-td-loading">
                        <RefreshCw size={48} className="spin-icon" />
                        <p>Syncing Experience Database...</p>
                    </div>
                ) : tours.length === 0 ? (
                    <div className="dk-td-empty">
                        <div className="empty-icon-circle">
                            <Compass size={40} />
                        </div>
                        <h3>No Tours Registered</h3>
                        <p>You haven't created any guided experiences yet. Start building your portfolio to accept bookings.</p>
                        <Link to="/tours/create" className="dk-btn-primary mt-6">
                            Architect Your First Tour
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="dk-tour-grid">
                            {tours.map((tour: ITour) => (
                                <div key={tour.id} className="dk-tour-card">
                                    
                                    {/* MEDIA & BADGES */}
                                    <div className="dk-tour-media">
                                        <ImageSlider images={tour.images || []} name={tour.name} />
                                        <div className="dk-tour-badges-top">
                                            {tour.isApproved ? (
                                                <div className="dk-badge-status approved">
                                                    <CheckCircle size={12} /> Live
                                                </div>
                                            ) : (
                                                <div className="dk-badge-status pending">
                                                    <Clock size={12} /> Pending Review
                                                </div>
                                            )}
                                            {tour.isFeatured && (
                                                <div className="dk-badge-featured">Featured</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* BODY */}
                                    <div className="dk-tour-body">
                                        <div className="dk-tour-title-row">
                                            <h3 title={tour.name}>{tour.name}</h3>
                                            <div className="dk-action-icons">
                                                <button 
                                                    className="dk-icon-btn danger" 
                                                    title="Delete Tour"
                                                    onClick={() => handleDelete(tour.id, tour.name)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="dk-tour-location">
                                            <MapPin size={14} className="text-blue-500" />
                                            <span>{tour.city ? `${tour.city}, ` : ''}{tour.address}</span>
                                        </div>

                                        <p className="dk-tour-desc">
                                            {tour.description || 'No description provided for this experience.'}
                                        </p>

                                        <div className="dk-tour-specs">
                                            <span className="dk-spec-pill">
                                                <Clock size={14} /> {tour.durationDays}D / {tour.durationNights}N
                                            </span>
                                            <span className="dk-spec-pill">
                                                <Users size={14} /> Max {tour.groupSizeMax} Pax
                                            </span>
                                            <span className="dk-spec-pill difficulty">
                                                <Compass size={14} /> {tour.difficulty}
                                            </span>
                                        </div>
                                    </div>

                                    {/* FOOTER (Price & Action) */}
                                    <div className="dk-tour-footer">
                                        <div className="dk-price-block">
                                            <span className="price-label">Per Explorer</span>
                                            <div className="price-value">
                                                <span className="currency">₼</span>{tour.pricePerPerson}
                                            </div>
                                        </div>
                                        
                                        <button 
                                            className="dk-btn-manage" 
                                            onClick={() => navigate(`/tours/edit/${tour.id}`)}
                                        >
                                            <PencilLine size={16} /> Manage Tour
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* PAGINATION */}
                        {pagination.totalPages > 1 && (
                            <div className="dk-pagination">
                                <button
                                    className="dk-page-btn"
                                    disabled={pagination.page <= 1}
                                    onClick={() => pagination.setPage(pagination.page - 1)}
                                >
                                    <ChevronLeft size={18} /> Prev
                                </button>
                                <div className="dk-page-info">
                                    Page <strong>{pagination.page}</strong> of {pagination.totalPages}
                                </div>
                                <button
                                    className="dk-page-btn"
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() => pagination.setPage(pagination.page + 1)}
                                >
                                    Next <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}