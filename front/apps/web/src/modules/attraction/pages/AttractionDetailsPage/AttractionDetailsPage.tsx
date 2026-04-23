import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Clock, 
    MapPin, 
    Star, 
    Heart, 
    Calendar, 
    Navigation, 
    Share2, 
    Info, 
    Image as ImageIcon,
    MessageCircle,
    ChevronRight,
    Users,
    X,
    CheckCircle2
} from 'lucide-react';

import { useAttraction } from '../../hooks/useAttraction';
import { useAttractionReviews } from '../../hooks/useAttractionReviews';
import { ReviewList } from '../../components/ReviewList/ReviewList';
import { ReviewForm } from '../../components/ReviewForm/ReviewForm';
import { getToken, getUserId } from '../../../../shared/utils/token';
import { attractionApi } from '../../api/attraction.api';
import { useNearbyAttractions } from '../../hooks/useNearbyAttractions';

// Components
import { WeatherWidget } from '../../components/WeatherWidget';
import { AudioGuide } from '../../components/AudioGuide';
import { ReportReviewModal } from '../../components/ReportReviewModal';
import { AttractionCard } from '../../components/AttractionCard/AttractionCard';

import './AttractionDetailsPage.css';

export const AttractionDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { attraction, isLoading, error } = useAttraction(id);
    const {
        reviews,
        isLoading: isReviewsLoading,
        submitReview,
        reportReview
    } = useAttractionReviews(attraction?.id);

    const { nearby, isLoading: isNearbyLoading } = useNearbyAttractions(
        attraction?.latitude,
        attraction?.longitude,
        50,
        5
    );

    // Interaction States
    const [isFavoriting, setIsFavoriting] = useState(false);
    const [reportModal, setReportModal] = useState<{ isOpen: boolean; reviewId: string | null }>({
        isOpen: false,
        reviewId: null
    });

    // Gallery States
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    const isAuthenticated = !!getToken();
    const userId = getUserId();
    const hasUserReviewed = reviews.some(r => r.userId === userId);

    // Scroll lock for gallery
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

    const handleFavorite = async () => {
        if (!isAuthenticated) {
            navigate('/auth/login', { state: { returnUrl: `/attractions/${id}` } });
            return;
        }
        if (!attraction?.id) return;

        setIsFavoriting(true);
        try {
            await attractionApi.toggleFavorite(attraction.id, getToken()!);
            // Toggles state could be handled via a refetch or local state update
        } catch (err) {
            console.error('Failed to toggle favorite');
        } finally {
            setIsFavoriting(false);
        }
    };

    const handleReportSubmit = async (reason: string, customNote?: string) => {
        if (!reportModal.reviewId || !attraction?.id) return { success: false, error: 'Missing data' };
        return await reportReview(reportModal.reviewId, reason, customNote);
    };

    if (isLoading) return <div className="loading-state">Exploring Karabakh's treasures...</div>;
    if (error || !attraction) return <div className="error-state">{error || 'This attraction is currently hidden or moved.'}</div>;

    const images = attraction.images && attraction.images.length > 0 
        ? attraction.images.map(img => img.url) 
        : ['https://placehold.co/1200x600?text=No+Image+Available'];

    const fullLocation = `${attraction.address ? attraction.address + ', ' : ''}${attraction.city || 'Karabakh'}, Azerbaijan`;

    return (
        <div className="attraction-detail-page">
            <main className="container">
                
                {/* BREADCRUMB */}
                <div className="premium-breadcrumb">
                    <span>Destinations</span>
                    <ChevronRight size={12} />
                    <span>{attraction.city || 'Karabakh'}</span>
                    <ChevronRight size={12} />
                    <span className="current">{attraction.name}</span>
                </div>

                {/* HEADER SECTION */}
                <header className="premium-header">
                    <div className="header-info">
                        <h1>{attraction.name}</h1>
                        <div className="meta-row">
                            {attraction.category && (
                                <>
                                    <div className="badge-pill">
                                        <MapPin size={16} />
                                        <span>{attraction.category.name}</span>
                                    </div>
                                    <span className="dot">•</span>
                                </>
                            )}
                            <div className="badge-pill rating-pill">
                                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                <span>{attraction.stats?.averageRating?.toFixed(1) || 'New'} Rating</span>
                            </div>
                            <span className="dot">•</span>
                            <div className="badge-pill">
                                <Users size={16} />
                                <span>{attraction.crowdLevel || 'Normal'} Crowd</span>
                            </div>
                            <span className="dot">•</span>
                            <div className="location">
                                <MapPin size={16} />
                                <span>{fullLocation}</span>
                            </div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn-premium" onClick={handleFavorite} disabled={isFavoriting}>
                            <Heart size={20} fill={isFavoriting ? "currentColor" : "none"} color={isFavoriting ? "var(--dk-primary)" : "currentColor"} />
                        </button>
                        <button className="icon-btn-premium"><Share2 size={20} /></button>
                    </div>
                </header>

                {/* IMAGE GALLERY SECTION */}
                <section className={`premium-image-gallery count-${images.length}`}>
                    <div className={`gallery-grid images-${Math.min(images.length, 5)}`}>
                        {/* Main Image */}
                        <div className="gallery-main" onClick={() => openGallery(0)}>
                            <img src={images[0]} alt={attraction.name} />
                            <div className="gallery-overlay">
                                <ImageIcon size={18} />
                                <span>View All Photos</span>
                            </div>
                        </div>

                        {images.length === 2 && (
                            <div className="gallery-side-single" onClick={() => openGallery(1)}>
                                <img src={images[1]} alt={attraction.name} />
                            </div>
                        )}

                        {images.length === 3 && (
                            <div className="gallery-side-stacked">
                                <div className="side-item" onClick={() => openGallery(1)}>
                                    <img src={images[1]} alt={attraction.name} />
                                </div>
                                <div className="side-item" onClick={() => openGallery(2)}>
                                    <img src={images[2]} alt={attraction.name} />
                                </div>
                            </div>
                        )}

                        {images.length >= 4 && (
                            <div className="gallery-thumbnails">
                                {images.slice(1, 5).map((img, idx) => (
                                    <div key={idx} className="thumb-item" onClick={() => openGallery(idx + 1)}>
                                        <img src={img} alt={`${attraction.name} ${idx + 2}`} />
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
                        
                        {/* Quick Interactive Features */}
                        {(attraction.audioUrl || attraction.virtualTourUrl) && (
                            <div className="quick-actions-bar">
                                <WeatherWidget attractionId={attraction.id} />
                                {attraction.audioUrl && <AudioGuide audioUrl={attraction.audioUrl} />}
                                {attraction.virtualTourUrl && (
                                    <button className="vr-action-btn" onClick={() => window.open(attraction.virtualTourUrl!, '_blank')}>
                                        <ImageIcon size={18} />
                                        <span>360° Virtual Tour</span>
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="premium-card">
                            <h2><Info size={24} className="heading-icon"/> About This Destination</h2>
                            <p className="about-text">{attraction.description}</p>
                            
                            {attraction.searchKeywords && (
                                <div className="keywords-wrapper">
                                    {attraction.searchKeywords.split(',').map(tag => (
                                        <span key={tag} className="tag-pill">#{tag.trim()}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* MAP WIDGET */}
                        <div className="premium-card map-wrapper-card">
                            <h2><Navigation size={24} className="heading-icon"/> Map & Directions</h2>
                            <div className="map-embed">
                                <iframe 
                                    title="Map" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    loading="lazy" 
                                    src={`https://maps.google.com/maps?q=$${attraction.latitude},${attraction.longitude}&z=15&output=embed`}
                                ></iframe>
                            </div>
                            <div className="directions-actions">
                                <a href={`https://www.google.com/maps/dir/?api=1&destination=$${attraction.latitude},${attraction.longitude}`} target="_blank" rel="noopener noreferrer" className="nav-way google">
                                    <Navigation size={16} /> Open in Google Maps
                                </a>
                                <a href={`https://yandex.com/maps/?rtext=~${attraction.latitude},${attraction.longitude}`} target="_blank" rel="noopener noreferrer" className="nav-way yandex">
                                    <Navigation size={16} /> Open in Yandex Maps
                                </a>
                            </div>
                        </div>

                        {/* NEARBY EVENTS */}
                        {attraction.nearbyEvents && attraction.nearbyEvents.length > 0 && (
                            <div className="premium-card">
                                <h2><Calendar size={24} className="heading-icon"/> Nearby Events</h2>
                                <div className="events-timeline">
                                    {attraction.nearbyEvents.map((event, idx) => (
                                        <div key={event.id || idx} className="event-node">
                                            <div className="event-date-box">
                                                <span className="day">{new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric' })}</span>
                                                <span className="month">{new Date(event.startDate).toLocaleDateString('en-GB', { month: 'short' })}</span>
                                            </div>
                                            <div className="event-content">
                                                <h4>{event.title}</h4>
                                                <button className="text-btn">View Details</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* REVIEWS SECTION */}
                        <div className="premium-card reviews-card">
                            <h2><MessageCircle size={24} className="heading-icon"/> Voices of Visitors</h2>
                            
                            <div className="reviews-wrapper">
                                <ReviewList 
                                    reviews={reviews} 
                                    isLoading={isReviewsLoading}
                                    onReport={(reviewId) => setReportModal({ isOpen: true, reviewId })} 
                                />
                            </div>

                            <div className="review-form-wrapper">
                                {isAuthenticated ? (
                                    hasUserReviewed ? (
                                        <div className="already-reviewed-panel">
                                            <CheckCircle2 size={24} color="#22c55e" />
                                            <p>You have already shared your experience with this destination. Thank you!</p>
                                        </div>
                                    ) : (
                                        <ReviewForm onSubmit={submitReview} />
                                    )
                                ) : (
                                    <div className="login-prompt">
                                        <p>Share your journey and thoughts with us.</p>
                                        <button className="primary-action-btn" onClick={() => navigate('/auth/login')}>Join to Review</button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: SIDEBAR WIDGET */}
                    <div className="split-sidebar">
                        
                        <div className="premium-card booking-cta-card">
                            <div className="price-tag">
                                <span className="currency">₼</span>
                                <span className="amount">{attraction.price || 0}</span>
                                <span className="period">/ person</span>
                            </div>
                            
                            <div className="status-indicator">
                                <CheckCircle2 size={16} />
                                <span>Reservation Active</span>
                            </div>

                            <p className="cta-description">
                                Professional guides and priority entrance included.
                            </p>

                            <button 
                                className="primary-booking-btn" 
                                onClick={() => navigate(`/attraction-checkout?attractionId=${attraction.id}`)}
                            >
                                Book Experience or Add to Collection
                            </button>

                            <div className="info-notes">
                                <Info size={14} />
                                <span>Free cancellation up to 24h before</span>
                            </div>
                        </div>

                        <div className="premium-card sticky-sidebar-card mt-6">
                            
                            {/* Working Hours */}
                            {attraction.workingHours && attraction.workingHours.length > 0 && (
                                <div className="booking-detail-box">
                                    <label><Clock size={14}/> VISITING HOURS</label>
                                    <ul className="schedule-list">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, ix) => {
                                            const schedule = attraction.workingHours?.find(h => h.dayOfWeek === (ix + 1) % 7);
                                            return (
                                                <li key={day} className={schedule?.isClosed ? 'closed' : ''}>
                                                    <span className="day">{day}</span>
                                                    <span className="hours">
                                                        {schedule?.isClosed ? 'Closed' : (schedule?.openTime ? `${schedule.openTime} - ${schedule.closeTime}` : '24h')}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            <button className="sidebar-action-btn secondary" onClick={handleFavorite}>
                                {isFavoriting ? 'Saving...' : 'Save to Favorites'}
                            </button>

                            <div className="trust-badges">
                                <div className="trust-item"><CheckCircle2 size={18} /> Verified Destination</div>
                                <div className="trust-item"><Navigation size={18} /> Easy Access Maps</div>
                                <div className="trust-item"><Star size={18} /> Community Reviewed</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEARBY ATTRACTIONS (Bottom Grid) */}
                {(isNearbyLoading || (nearby && nearby.length > 0)) && (
                    <div className="nearby-bottom-section">
                        <h2><Navigation size={24} className="heading-icon"/> Discover Nearby Gems</h2>
                        {isNearbyLoading ? (
                            <div className="loading-nearby">Finding more gems nearby...</div>
                        ) : (
                            <div className="tour-grid">
                                {nearby.map(item => (
                                    <AttractionCard key={item.id} attraction={item} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </main>

            {/* FULLSCREEN GALLERY MODAL */}
            {isGalleryOpen && (
                <div className="fullscreen-gallery-modal" onClick={() => setIsGalleryOpen(false)}>
                    <button className="gallery-close-btn" onClick={() => setIsGalleryOpen(false)}>
                        <X size={24} />
                    </button>
                    <div className="gallery-main-view" onClick={e => e.stopPropagation()}>
                        <img src={images[activeImgIndex]} alt={attraction.name} className="gallery-active-img" />
                    </div>
                    {images.length > 1 && (
                        <div className="gallery-thumbs-bar" onClick={e => e.stopPropagation()}>
                            {images.map((img, idx) => (
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

            <ReportReviewModal 
                isOpen={reportModal.isOpen}
                onClose={() => setReportModal({ isOpen: false, reviewId: null })}
                onSubmit={handleReportSubmit}
            />
        </div>
    );
};