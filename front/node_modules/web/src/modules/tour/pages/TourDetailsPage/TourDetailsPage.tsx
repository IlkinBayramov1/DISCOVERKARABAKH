import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tourWebApi } from '../../api/tour.api';
import { useTourAvailability } from '../../hooks/useTourAvailability';
import type { ITour } from '../../types';
import './TourDetailsPage.css';

export const TourDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [tour, setTour] = useState<ITour | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { availability, loading: availabilityLoading, checkAvailability } = useTourAvailability();

    // Gallery State - YENI
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    // Gallery scroll lock - YENI
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

    useEffect(() => {
        const fetchTour = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await tourWebApi.getTourById(id);
                if (response.success && response.data) {
                    setTour(response.data);
                } else {
                    setError('Tour not found');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch tour details');
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [id]);

    useEffect(() => {
        if (id && tour?.startDate) {
            checkAvailability(id, tour.startDate.split('T')[0]);
        }
    }, [id, tour?.startDate, checkAvailability]);

    if (loading) return <div className="loading-state">Loading tour details...</div>;
    if (error) return <div className="error-state">{error}</div>;
    if (!tour) return <div className="empty-state">Tour not found</div>;

    // Image URL helper - YENI
    const getImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/800x600?text=No+Image';
        if (url.startsWith('http') || url.startsWith('/images/')) return url;
        return `http://localhost:4004${url.startsWith('/') ? '' : '/'}${url}`;
    };

    // Prepare gallery images safely
    const images = tour.images && tour.images.length > 0 ? tour.images : ['https://placehold.co/800x600?text=No+Image'];

    // Format location string safely - YENI
    const meetingPlace = tour.address ? `${tour.address}, ` : '';
    const cityText = tour.city || 'Karabakh';
    const fullLocation = `${meetingPlace}${cityText}, Azerbaijan`;

    return (
        <div className="tour-detail-page">
            <main className="container">
                
                {/* BREADCRUMB - YENI */}
                <div className="premium-breadcrumb">
                    <span>Experiences & Tours</span>
                    <i className="fa-solid fa-chevron-right"></i>
                    <span>{tour.city || 'Karabakh'}</span>
                    <i className="fa-solid fa-chevron-right"></i>
                    <span className="current">{tour.name}</span>
                </div>

                {/* HEADER SECTION - YENI */}
                <header className="premium-tour-header">
                    <div className="header-info">
                        <h1>{tour.name}</h1>
                        <div className="meta-row">
                            <div className="tour-badge-pill">
                                <i className="fa-solid fa-clock"></i>
                                <span>{tour.durationDays} Days / {tour.durationNights} Nights</span>
                            </div>
                            <span className="dot">•</span>
                            <div className="tour-badge-pill">
                                <i className="fa-solid fa-users"></i>
                                <span>{tour.groupSizeMin}-{tour.groupSizeMax} People</span>
                            </div>
                            <span className="dot">•</span>
                            <div className="location">
                                <i className="fa-solid fa-location-dot"></i>
                                <span>{fullLocation}</span>
                            </div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn-premium"><i className="fa-regular fa-heart"></i></button>
                        <button className="icon-btn-premium"><i className="fa-solid fa-share-nodes"></i></button>
                    </div>
                </header>

                {/* IMAGE GALLERY SECTION - YENI & DINAMIK */}
                <section className={`premium-image-gallery count-${tour.images.length}`}>
                    {tour.images && tour.images.length > 0 ? (
                        <div className={`gallery-grid images-${Math.min(tour.images.length, 5)}`}>
                            
                            {/* Ana Şəkil */}
                            <div className="gallery-main" onClick={() => openGallery(0)}>
                                <img src={getImageUrl(images[0])} alt={tour.name} />
                                <div className="gallery-overlay">
                                    <i className="fa-regular fa-images"></i>
                                    <span>View All Photos</span>
                                </div>
                            </div>

                            {/* Digər Şəkillər - Sayına görə fərqli düzülüş */}
                            {tour.images.length === 2 && (
                                <div className="gallery-side-single" onClick={() => openGallery(1)}>
                                    <img src={getImageUrl(images[1])} alt={tour.name} />
                                </div>
                            )}

                            {tour.images.length === 3 && (
                                <div className="gallery-side-stacked">
                                    <div className="side-item" onClick={() => openGallery(1)}>
                                        <img src={getImageUrl(images[1])} alt={tour.name} />
                                    </div>
                                    <div className="side-item" onClick={() => openGallery(2)}>
                                        <img src={getImageUrl(images[2])} alt={tour.name} />
                                    </div>
                                </div>
                            )}

                            {tour.images.length >= 4 && (
                                <div className="gallery-thumbnails">
                                    {tour.images.slice(1, 5).map((img, idx) => (
                                        <div key={idx} className="thumb-item" onClick={() => openGallery(idx + 1)}>
                                            <img src={getImageUrl(img)} alt={`${tour.name} ${idx + 2}`} />
                                            {idx === 3 && tour.images.length > 5 && (
                                                <div className="more-overlay">
                                                    <span>+{tour.images.length - 5}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="gallery-main no-image">
                            <img src="https://placehold.co/1200x600?text=No+Images+Available" alt="No images" />
                        </div>
                    )}
                </section>

                {/* CONTENT SPLIT - YENI */}
                <div className="premium-content-split">
                    {/* LEFT COLUMN: DETAILS */}
                    <div className="split-main">
                        
                        <div className="premium-card">
                            <h2>Tour Overview</h2>
                            <p className="about-text">{tour.description}</p>
                        </div>

                        {/* ITINERARY TIMELINE - YENI */}
                        <div className="premium-card">
                            <h2>Itinerary</h2>
                            <div className="itinerary-timeline">
                                {tour.itinerary?.map((day) => (
                                    <div key={day.day} className="timeline-node">
                                        <div className="timeline-marker">
                                            <span>{day.day}</span>
                                        </div>
                                        <div className="timeline-content">
                                            <h3 className="timeline-title">{day.title}</h3>
                                            <p className="timeline-desc">{day.description}</p>
                                            
                                            {day.activities && day.activities.length > 0 && (
                                                <div className="activity-list">
                                                    {day.activities.map((activity, aIdx) => (
                                                        <div key={aIdx} className="activity-box">
                                                            <div className="activity-time">
                                                                <i className="fa-regular fa-clock"></i> {activity.time}
                                                            </div>
                                                            <div className="activity-text">{activity.description}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {day.meals && day.meals.length > 0 && (
                                                <div className="meals-pill-container">
                                                    {day.meals.map((meal, mIdx) => (
                                                        <span key={mIdx} className="meal-pill">
                                                            <i className="fa-solid fa-utensils"></i> {meal}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* MAP WIDGET - YENI */}
                        <div className="premium-card map-wrapper-card">
                            <h2>Meeting Point</h2>
                            <div className="map-embed">
                                <iframe 
                                    title="Map" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    loading="lazy" 
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(fullLocation)}&z=15&output=embed`}
                                ></iframe>
                                <a 
                                    className="map-overlay-btn" 
                                    href={`https://maps.google.com/maps?q=${encodeURIComponent(fullLocation)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-solid fa-location-crosshairs"></i> View on map
                                </a>
                            </div>
                            <div className="map-text-info">
                                <strong>Location</strong>
                                <span>{fullLocation}</span>
                            </div>
                        </div>

                        {/* INCLUSIONS & EXCLUSIONS - YENI */}
                        <div className="inc-exc-grid">
                            <div className="premium-card inclusion-card">
                                <h3><i className="fa-solid fa-circle-check"></i> What's Included</h3>
                                <ul className="inc-list">
                                    {(tour.inclusions || []).map((item, idx) => (
                                        <li key={idx}><span></span>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="premium-card exclusion-card">
                                <h3><i className="fa-solid fa-circle-xmark"></i> What's Not Included</h3>
                                <ul className="exc-list">
                                    {(tour.exclusions || []).map((item, idx) => (
                                        <li key={idx}><span></span>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: BOOKING WIDGET - YENI */}
                    <div className="split-sidebar">
                        <div className="premium-card booking-sidebar-card">
                            <div className="booking-price-header">
                                <span className="price-label">Price per person</span>
                                <div className="price-amount-wrap">
                                    <span className="currency">₼</span>
                                    <span className="amount">{tour.pricePerPerson}</span>
                                </div>
                            </div>

                            <div className="booking-detail-box">
                                <label>TOUR DATE</label>
                                {tour.startDate ? (
                                    <div className="date-display">
                                        <i className="fa-regular fa-calendar"></i>
                                        {new Date(tour.startDate).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </div>
                                ) : (
                                    <div className="date-empty">Date not specified</div>
                                )}
                            </div>

                            {(availability || tour.availableSlots !== undefined) && (
                                <div className="availability-box">
                                    <div className="av-header">
                                        <span>Availability</span>
                                        <div className={`av-status ${
                                            (tour.availableSlots !== undefined ? tour.availableSlots <= 0 : availability?.isFull) 
                                                ? 'full' : 'open'
                                        }`}>
                                            {(tour.availableSlots !== undefined ? tour.availableSlots <= 0 : availability?.isFull) 
                                                ? 'FULLY BOOKED' : 'LIMITED SPOTS'
                                            }
                                        </div>
                                    </div>
                                    <div className="av-progress-track">
                                        <div 
                                            className="av-progress-fill"
                                            style={{ 
                                                width: `${((tour.groupSizeMax - (tour.availableSlots ?? 0)) / tour.groupSizeMax) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="av-seats-text">
                                        🔥 {tour.availableSlots ?? availability?.remainingSeats} places left of {tour.groupSizeMax}
                                    </span>
                                </div>
                            )}

                            {availabilityLoading && !availability && (
                                <div className="availability-loading animate-pulse">
                                    <div className="bar-bg"></div>
                                </div>
                            )}

                            <button
                                onClick={() => navigate(`/tour-checkout?tourId=${tour.id}`)}
                                disabled={(tour.availableSlots !== undefined ? tour.availableSlots <= 0 : availability?.isFull) || availabilityLoading}
                                className={`sidebar-action-btn ${
                                    (tour.availableSlots !== undefined ? tour.availableSlots <= 0 : availability?.isFull) ? 'disabled' : ''
                                }`}
                            >
                                {(tour.availableSlots !== undefined ? tour.availableSlots <= 0 : availability?.isFull) 
                                    ? 'Sold Out' : 'Book This Adventure'
                                }
                            </button>

                            <div className="trust-badges">
                                <div className="trust-item"><i className="fa-solid fa-shield-halved"></i> Secure Payment</div>
                                <div className="trust-item"><i className="fa-solid fa-bolt"></i> Instant Confirmation</div>
                                <div className="trust-item"><i className="fa-solid fa-headset"></i> 24/7 Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* FULLSCREEN GALLERY MODAL - YENI */}
            {isGalleryOpen && (
                <div className="fullscreen-gallery-modal" onClick={() => setIsGalleryOpen(false)}>
                    <button className="gallery-close-btn" onClick={() => setIsGalleryOpen(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className="gallery-main-view" onClick={e => e.stopPropagation()}>
                        <img src={getImageUrl(images[activeImgIndex])} alt={tour.name} className="gallery-active-img" />
                    </div>
                    {images.length > 1 && (
                        <div className="gallery-thumbs-bar" onClick={e => e.stopPropagation()}>
                            {images.map((img, idx) => (
                                <img 
                                    key={idx} 
                                    src={getImageUrl(img)} 
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