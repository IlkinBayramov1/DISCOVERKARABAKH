import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useVehicle } from '../../hooks/useVehicle';
import { useBooking } from '../../../booking/hooks/useBooking';
import { 
    Car, Users, Briefcase, Calendar, 
    MapPin, Navigation, ChevronRight, 
    X, ShieldCheck, CheckCircle, Heart, Share2, Images
} from 'lucide-react';
import './TransportDetailsPage.css';

export const TransportDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    
    const searchData = location.state || {};
    const { pickupLocation, dropoffLocation, bookingDate } = searchData;

    const { data: vehicleResponse, isLoading } = useVehicle(id);
    const { loading: isBooking } = useBooking();

    // Gallery State
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    const vehicle = vehicleResponse?.data;

    // Gallery scroll lock
    useEffect(() => {
        if (isGalleryOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isGalleryOpen]);

    const openGallery = (index: number = 0) => {
        setActiveImgIndex(index);
        setIsGalleryOpen(true);
    };

    const handleConfirmBooking = () => {
        if (!vehicle) return;
        
        navigate('/transport-checkout', {
            state: {
                ...searchData,
                vehicleId: vehicle.id,
                vehicleBrand: vehicle.brand,
                vehicleModel: vehicle.model,
                vehicleImage: vehicle.images?.[0] || null,
                totalPrice: searchData.totalPrice || vehicle.basePrice,
                distanceKm: searchData.distanceKm || 0
            }
        });
    };

    if (isLoading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading vehicle details...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="error-state">
                Vehicle not found or no longer available.
                <button onClick={() => navigate(-1)} className="ghost-btn" style={{ marginTop: '16px' }}>Go Back</button>
            </div>
        );
    }

    const images = vehicle.images && vehicle.images.length > 0 
        ? vehicle.images 
        : ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1200'];

    const hasRoute = searchData.isSearched && !!pickupLocation?.address && !!dropoffLocation?.address;

    return (
        <div className="transport-detail-page">
            <main className="container">
                
                {/* BREADCRUMB */}
                <div className="premium-breadcrumb">
                    <span>Transfers & Vehicles</span>
                    <ChevronRight size={12} />
                    <span>{vehicle.category || 'Standard'}</span>
                    <ChevronRight size={12} />
                    <span className="current">{vehicle.brand} {vehicle.model}</span>
                </div>

                {/* HEADER SECTION */}
                <header className="premium-transport-header">
                    <div className="header-info">
                        <h1>{vehicle.brand} {vehicle.model}</h1>
                        <div className="meta-row">
                            <div className="transport-badge-pill">
                                <Car size={16} />
                                <span>{vehicle.category || 'Standard'}</span>
                            </div>
                            <span className="dot">•</span>
                            <div className="transport-badge-pill">
                                <Users size={16} />
                                <span>Up to {vehicle.seats} Pax</span>
                            </div>
                            <span className="dot">•</span>
                            <div className="transport-badge-pill">
                                <Briefcase size={16} />
                                <span>{vehicle.luggage || 2} Bags</span>
                            </div>
                            <span className="dot">•</span>
                            <div className="location">
                                <ShieldCheck size={16} />
                                <span>{vehicleResponse?.owner?.vendorProfile?.companyName || 'Verified Partner'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn-premium"><Heart size={20} /></button>
                        <button className="icon-btn-premium"><Share2 size={20} /></button>
                    </div>
                </header>

                {/* IMAGE GALLERY SECTION */}
                <section className={`premium-image-gallery count-${images.length}`}>
                    <div className={`gallery-grid images-${Math.min(images.length, 5)}`}>
                        
                        {/* Main Image */}
                        <div className="gallery-main" onClick={() => openGallery(0)}>
                            <img src={images[0]} alt={`${vehicle.brand} ${vehicle.model}`} />
                            <div className="gallery-overlay">
                                <Images size={18} />
                                <span>View All Photos</span>
                            </div>
                        </div>

                        {/* Side Images (Conditional Rendering based on count) */}
                        {images.length === 2 && (
                            <div className="gallery-side-single" onClick={() => openGallery(1)}>
                                <img src={images[1]} alt="Vehicle interior" />
                            </div>
                        )}

                        {images.length === 3 && (
                            <div className="gallery-side-stacked">
                                <div className="side-item" onClick={() => openGallery(1)}>
                                    <img src={images[1]} alt="Vehicle side" />
                                </div>
                                <div className="side-item" onClick={() => openGallery(2)}>
                                    <img src={images[2]} alt="Vehicle interior" />
                                </div>
                            </div>
                        )}

                        {images.length >= 4 && (
                            <div className="gallery-thumbnails">
                                {images.slice(1, 5).map((img: string, idx: number) => (
                                    <div key={idx} className="thumb-item" onClick={() => openGallery(idx + 1)}>
                                        <img src={img} alt={`Vehicle view ${idx + 2}`} />
                                        {idx === 3 && images.length > 5 && (
                                            <div className="more-overlay">
                                                <span>+{images.length - 5}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* CONTENT SPLIT */}
                <div className="premium-content-split">
                    {/* LEFT COLUMN: DETAILS */}
                    <div className="split-main">
                        
                        <div className="premium-card">
                            <h2>Vehicle Overview</h2>
                            <p className="about-text">{vehicle.description || 'No detailed description provided for this vehicle. However, all our vehicles adhere to strict cleanliness and safety standards.'}</p>
                        </div>

                        <div className="premium-card">
                            <h2>Features & Amenities</h2>
                            <div className="features-grid">
                                <div className="feature-item">
                                    <Users className="feature-icon" />
                                    <div>
                                        <span className="label">Passenger Capacity</span>
                                        <span className="value">Up to {vehicle.seats} people</span>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <Briefcase className="feature-icon" />
                                    <div>
                                        <span className="label">Luggage Space</span>
                                        <span className="value">{vehicle.luggage || 2} suitcases</span>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <Calendar className="feature-icon" />
                                    <div>
                                        <span className="label">Manufacturing Year</span>
                                        <span className="value">{vehicle.year || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <ShieldCheck className="feature-icon" />
                                    <div>
                                        <span className="label">Safety Status</span>
                                        <span className="value safe">Fully Insured</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SERVICE PERKS */}
                        <div className="inc-exc-grid">
                            <div className="premium-card inclusion-card">
                                <h3><CheckCircle size={20} /> Service Guarantees</h3>
                                <ul className="inc-list">
                                    <li><span></span>Professional, vetted driver</li>
                                    <li><span></span>Clean & comfortable interior</li>
                                    <li><span></span>Air conditioning included</li>
                                    <li><span></span>24/7 customer support</li>
                                </ul>
                            </div>
                            <div className="premium-card inclusion-card" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
                                <h3 style={{ color: '#0f172a' }}><Car size={20} /> Vehicle Rules</h3>
                                <ul className="inc-list" style={{ color: '#475569' }}>
                                    <li style={{ color: '#475569' }}><span style={{ background: '#94a3b8' }}></span>No smoking inside the vehicle</li>
                                    <li style={{ color: '#475569' }}><span style={{ background: '#94a3b8' }}></span>Seatbelts mandatory</li>
                                    <li style={{ color: '#475569' }}><span style={{ background: '#94a3b8' }}></span>Pets must be in carriers</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: BOOKING WIDGET */}
                    <div className="split-sidebar">
                        <div className="premium-card booking-sidebar-card">
                            
                            <div className="booking-price-header">
                                <span className="price-label">{hasRoute ? 'Total Estimated Fare' : 'Base Starting Fare'}</span>
                                <div className="price-amount-wrap">
                                    <span className="currency">₼</span>
                                    <span className="amount">{searchData.totalPrice || vehicle.basePrice}</span>
                                </div>
                            </div>

                            <div className="route-summary-box">
                                <h4>Trip Details</h4>
                                
                                <div className="route-point">
                                    <div className="r-icon"><MapPin size={16} /></div>
                                    <div className="r-info">
                                        <span className="r-label">Pickup Point</span>
                                        <span className="r-value">{pickupLocation?.address || 'Not selected'}</span>
                                    </div>
                                </div>
                                
                                <div className="route-point">
                                    <div className="r-icon"><Navigation size={16} /></div>
                                    <div className="r-info">
                                        <span className="r-label">Drop-off Destination</span>
                                        <span className="r-value">{dropoffLocation?.address || 'Not selected'}</span>
                                    </div>
                                </div>

                                <div className="route-point no-border">
                                    <div className="r-icon"><Calendar size={16} /></div>
                                    <div className="r-info">
                                        <span className="r-label">Date & Time</span>
                                        <span className="r-value">
                                            {searchData.isSearched && bookingDate ? new Date(bookingDate).toLocaleString('en-GB', {
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                            }) : 'Immediate Departure'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmBooking}
                                disabled={isBooking || !hasRoute}
                                className={`sidebar-action-btn ${!hasRoute ? 'disabled' : ''}`}
                            >
                                {isBooking ? 'Processing...' : 'Confirm & Book'}
                            </button>

                            {!hasRoute && (
                                <p className="booking-warning">
                                    * Please return to the search page to specify your pickup and drop-off locations to calculate the exact fare.
                                </p>
                            )}

                            <div className="trust-badges">
                                <div className="trust-item"><ShieldCheck size={18} /> Secure Payment</div>
                                <div className="trust-item"><Car size={18} /> Verified Vehicle</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* FULLSCREEN GALLERY MODAL */}
            {isGalleryOpen && (
                <div className="fullscreen-gallery-modal" onClick={() => setIsGalleryOpen(false)}>
                    <button className="gallery-close-btn" onClick={() => setIsGalleryOpen(false)}>
                        <X size={24} />
                    </button>
                    
                    <div className="gallery-main-view" onClick={e => e.stopPropagation()}>
                        <img src={images[activeImgIndex]} alt={`${vehicle.brand} ${activeImgIndex}`} className="gallery-active-img" />
                    </div>
                    
                    {images.length > 1 && (
                        <div className="gallery-thumbs-bar" onClick={e => e.stopPropagation()}>
                            {images.map((img: string, idx: number) => (
                                <img 
                                    key={idx} 
                                    src={img} 
                                    alt={`Thumbnail ${idx + 1}`}
                                    className={idx === activeImgIndex ? 'active' : ''}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveImgIndex(idx);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};