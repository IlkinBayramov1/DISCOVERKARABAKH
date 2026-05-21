import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHotels } from '../../hooks/useHotels';
import { 
    Plus, 
    RefreshCw, 
    Building2, 
    MapPin, 
    Star, 
    BedDouble, 
    PencilLine, 
    Trash2,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import './MyHotel.css';

// Minimal Daxili Image Slider Komponenti
const PropertyImageSlider = ({ images, name }: { images: any[], name: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="dk-prop-no-image">
                <ImageIcon size={48} />
                <span>No property media uploaded</span>
            </div>
        );
    }

    const nextImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    };

    const prevImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    };

    const currentImage = images[currentIndex].url || images[currentIndex];

    return (
        <div className="dk-prop-slider">
            <img src={currentImage} alt={`${name} - ${currentIndex + 1}`} />
            {images.length > 1 && (
                <>
                    <button className="slider-nav prev" onClick={prevImg}><ChevronLeft size={24} /></button>
                    <button className="slider-nav next" onClick={nextImg}><ChevronRight size={24} /></button>
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

export default function MyHotel() {
    const navigate = useNavigate();
    const { data: hotels, loading, error, removeHotel } = useHotels(true);

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you absolutely sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
            await removeHotel(id);
        }
    };

    // Vendorun yalniz 1 oteli olacagindan birincini gotururuk
    const myProperty = hotels && hotels.length > 0 ? hotels[0] : null;

    return (
        <div className="dk-prop-layout">
            <div className="dk-prop-container">
                
                {/* HEADER */}
                <header className="dk-prop-header">
                    <div>
                        <h1 className="dk-prop-title">My Property</h1>
                        <p className="dk-prop-subtitle">Manage your primary accommodation listing and business profile.</p>
                    </div>
                    {!myProperty && !loading && (
                        <Link to="/hotel/create" className="dk-btn-primary">
                            <Plus size={18} /> Establish New Listing
                        </Link>
                    )}
                </header>

                {error && <div className="dk-alert-error">{error}</div>}

                {/* CONTENT AREA */}
                <div className="dk-prop-content">
                    {loading ? (
                        <div className="dk-loading-state">
                            <RefreshCw size={48} className="spin-icon" />
                            <p>Syncing property registry...</p>
                        </div>
                    ) : !myProperty ? (
                        <div className="dk-empty-state">
                            <div className="empty-icon-wrap">
                                <Building2 size={48} />
                            </div>
                            <h3>No Active Listing</h3>
                            <p>You haven't registered a property yet. Start creating your professional profile to accept reservations globally.</p>
                            <Link to="/hotel/create" className="dk-btn-primary mt-6">
                                Create Property Blueprint
                            </Link>
                        </div>
                    ) : (
                        <div className="dk-active-property-view">
                            
                            {/* Visual & Core Data */}
                            <div className="dk-prop-hero-card">
                                <div className="hero-media-section">
                                    <PropertyImageSlider images={myProperty.images || []} name={myProperty.name} />
                                    
                                    {/* Overlays */}
                                    <div className={`status-pill ${myProperty.status}`}>
                                        {myProperty.status === 'approved' ? <CheckCircle size={14} /> : <RefreshCw size={14} />}
                                        {myProperty.status?.toUpperCase() || 'PENDING'}
                                    </div>
                                    
                                    {myProperty.isFeatured && (
                                        <div className="featured-pill">
                                            <Star size={14} fill="currentColor" /> Premium Listed
                                        </div>
                                    )}
                                </div>

                                <div className="hero-info-section">
                                    <div className="info-header">
                                        <h2>{myProperty.name}</h2>
                                        <div className="rating-box">
                                            <Star size={16} fill="currentColor" className="text-amber-400" />
                                            <span>{myProperty.rating ? myProperty.rating.toFixed(1) : 'NEW'}</span>
                                        </div>
                                    </div>

                                    <div className="info-badges">
                                        <span className="info-badge">
                                            <MapPin size={14} /> {myProperty.city}, Azerbaijan
                                        </span>
                                        <span className="info-badge outline">
                                            <Building2 size={14} /> {myProperty.propertyType?.toUpperCase() || 'HOTEL'}
                                        </span>
                                        <span className="info-badge outline stars">
                                            {Array.from({ length: myProperty.starRating || 3 }).map((_, i) => (
                                                <Star key={i} size={12} fill="currentColor" />
                                            ))}
                                        </span>
                                    </div>

                                    <div className="info-address">
                                        <label>Registered Address</label>
                                        <p>{myProperty.address}</p>
                                    </div>

                                    <div className="info-desc">
                                        <label>Official Description</label>
                                        <p>{myProperty.description || 'No description provided.'}</p>
                                    </div>

                                    <div className="info-policies-grid">
                                        <div className="policy-item">
                                            <label><AlertCircle size={14} /> Cancellation Policy</label>
                                            <p>{myProperty.cancellationPolicy || 'Standard policy applies'}</p>
                                        </div>
                                        <div className="policy-item">
                                            <label><Sparkles size={14} /> Pet Policy</label>
                                            <p>{myProperty.petPolicy || 'Contact management for details'}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Actions Dashboard */}
                            <div className="dk-prop-actions-panel">
                                <h3>Property Management</h3>
                                <div className="actions-grid">
                                    
                                    <button 
                                        className="action-card primary"
                                        onClick={() => navigate(`/rooms?hotelId=${myProperty.id}`)}
                                    >
                                        <div className="action-icon"><BedDouble size={24} /></div>
                                        <div className="action-texts">
                                            <h4>Manage Rooms & Inventory</h4>
                                            <p>Configure room types, pricing, and availability</p>
                                        </div>
                                        <ChevronRight className="action-arrow" />
                                    </button>

                                    <button 
                                        className="action-card secondary"
                                        onClick={() => navigate(`/hotel/edit/${myProperty.id}`)}
                                    >
                                        <div className="action-icon"><PencilLine size={24} /></div>
                                        <div className="action-texts">
                                            <h4>Edit Property DNA</h4>
                                            <p>Update photos, address, and core facilities</p>
                                        </div>
                                        <ChevronRight className="action-arrow" />
                                    </button>

                                    <div className="danger-zone">
                                        <p>Warning: Deleting your property will erase all associated room types and media.</p>
                                        <button 
                                            className="dk-btn-danger"
                                            onClick={() => handleDelete(myProperty.id, myProperty.name)}
                                        >
                                            <Trash2 size={16} /> Delete Property
                                        </button>
                                    </div>

                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}