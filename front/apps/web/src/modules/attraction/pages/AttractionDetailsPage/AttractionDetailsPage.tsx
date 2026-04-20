import React, { useState } from 'react';
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
    MessageCircle
} from 'lucide-react';
import { useAttraction } from '../../hooks/useAttraction';
import { useAttractionReviews } from '../../hooks/useAttractionReviews';
import { ReviewList } from '../../components/ReviewList/ReviewList';
import { ReviewForm } from '../../components/ReviewForm/ReviewForm';
import { getToken, getUserId } from '../../../../shared/utils/token';
import { attractionApi } from '../../api/attraction.api';
import { useNearbyAttractions } from '../../hooks/useNearbyAttractions';

// New Components
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

    const [isFavoriting, setIsFavoriting] = useState(false);
    const [reportModal, setReportModal] = useState<{ isOpen: boolean; reviewId: string | null }>({
        isOpen: false,
        reviewId: null
    });

    const isAuthenticated = !!getToken();
    const userId = getUserId();
    const hasUserReviewed = reviews.some(r => r.userId === userId);

    const handleFavorite = async () => {
        if (!isAuthenticated) {
            navigate('/auth/login', { state: { returnUrl: `/attractions/${id}` } });
            return;
        }
        if (!attraction?.id) return;

        setIsFavoriting(true);
        try {
            await attractionApi.toggleFavorite(attraction.id, getToken()!);
            alert('Favorites updated!');
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

    if (isLoading) return <div className="loading-screen glass">Exploring Karabakh's treasures...</div>;

    if (error || !attraction) {
        return (
            <div className="error-screen glass">
                <h2>Discovery Interrupted</h2>
                <p>{error || 'This attraction is currently hidden or moved.'}</p>
                <button className="primary-btn" onClick={() => navigate('/attractions')}>Back to Map</button>
            </div>
        );
    }

    const coverImage = attraction.images?.find(img => img.isCover)?.url
        || attraction.images?.[0]?.url
        || 'https://images.unsplash.com/photo-1549558549-415fe4c37b60?auto=format&fit=crop&q=80&w=2000';

    return (
        <div className="attraction-details-page">
            {/* HERO SECTION */}
            <div className="details-hero">
                <div className="hero-bg" style={{ backgroundImage: `url(${coverImage})` }}></div>
                <div className="hero-overlay"></div>
                <div className="hero-content-wrapper">
                    <div className="hero-left">
                        <div className="badges fade-in">
                            {attraction.isFeatured && <span className="badge featured">Premium Destination</span>}
                            {attraction.category && <span className="badge category">{attraction.category.name}</span>}
                        </div>
                        <h1 className="fade-in-up">{attraction.name}</h1>
                        <p className="location fade-in-up">
                            <MapPin size={18} /> {attraction.city || 'Karabakh'} • {attraction.address}
                        </p>
                    </div>
                </div>
            </div>

            <div className="details-container">
                <main className="details-main">
                    {/* QUICK ACTION BAR */}
                    <div className="quick-info-bar glass slide-up">
                        <WeatherWidget attractionId={attraction.id} />
                        {attraction.audioUrl && <AudioGuide audioUrl={attraction.audioUrl} />}
                        {attraction.virtualTourUrl && (
                            <button className="vr-btn glass" onClick={() => window.open(attraction.virtualTourUrl!, '_blank')}>
                                <ImageIcon size={20} />
                                <span>360° Virtual Tour</span>
                            </button>
                        )}
                    </div>

                    <section className="about-section glass">
                        <div className="section-title">
                            <Info size={22} />
                            <h2>About This Destination</h2>
                        </div>
                        <p className="description">{attraction.description}</p>
                        
                        {attraction.searchKeywords && (
                            <div className="keywords-wrapper">
                                {attraction.searchKeywords.split(',').map(tag => (
                                    <span key={tag} className="tag">#{tag.trim()}</span>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* GALLERY */}
                    {attraction.images && attraction.images.length > 1 && (
                        <section className="gallery-section glass">
                            <div className="section-title">
                                <ImageIcon size={22} />
                                <h2>Visual Gallery</h2>
                            </div>
                            <div className="gallery-grid">
                                {attraction.images.filter(img => !img.isCover).map(img => (
                                    <div key={img.id} className="gallery-item glass-hover">
                                        <img src={img.url} alt={attraction.name} />
                                        {img.type !== 'image' && <span className="media-type">{img.type}</span>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* NEARBY EVENTS */}
                    {attraction.nearbyEvents && attraction.nearbyEvents.length > 0 && (
                        <section className="events-section glass">
                            <div className="section-title">
                                <Calendar size={22} />
                                <h2>Nearby Events</h2>
                            </div>
                            <div className="events-grid">
                                {attraction.nearbyEvents.map(event => (
                                    <div key={event.id} className="event-card glass">
                                        <div className="event-info">
                                            <h4>{event.title}</h4>
                                            <p className="event-date">
                                                {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* NEARBY ATTRACTIONS */}
                    {(isNearbyLoading || (nearby && nearby.length > 0)) && (
                        <section className="nearby-section glass">
                            <div className="section-title">
                                <Navigation size={22} />
                                <h2>Nearby Discoveries</h2>
                            </div>
                            {isNearbyLoading ? (
                                <div className="loading-nearby">Finding more gems nearby...</div>
                            ) : (
                                <div className="nearby-grid">
                                    {nearby.map(item => (
                                        <AttractionCard key={item.id} attraction={item} />
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* REVIEWS */}
                    <section className="reviews-section glass">
                        <div className="section-title">
                            <MessageCircle size={22} />
                            <h2>Voices of Visitors ({reviews.length})</h2>
                        </div>
                        
                        <div className="reviews-wrapper">
                            <ReviewList 
                                reviews={reviews} 
                                isLoading={isReviewsLoading}
                                onReport={(reviewId) => setReportModal({ isOpen: true, reviewId })} 
                            />
                        </div>

                        <div className="review-form-container glass">
                            {isAuthenticated ? (
                                hasUserReviewed ? (
                                    <div className="already-reviewed-panel">
                                        <div className="check-icon">✓</div>
                                        <p>You have already shared your experience with this destination. Thank you!</p>
                                    </div>
                                ) : (
                                    <ReviewForm onSubmit={submitReview} />
                                )
                            ) : (
                                <div className="login-prompt">
                                    <p>Share your journey with us.</p>
                                    <button className="primary-btn" onClick={() => navigate('/auth/login')}>Join to Review</button>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                <aside className="details-sidebar">
                    <div className="info-card mega-card glass">
                        <div className="price-tag-big">
                            {attraction.entryType === 'free' ? (
                                <span className="free">Free Access</span>
                            ) : (
                                <div className="paid-price">
                                    <span className="currency">₼</span>
                                    <span className="val">{attraction.price}</span>
                                    <span className="unit">/ visitor</span>
                                </div>
                            )}
                        </div>

                        <div className="side-stats">
                            <div className="side-stat">
                                <Star size={20} className="star-icon" />
                                <div>
                                    <span className="stat-val">{attraction.stats?.averageRating?.toFixed(1) || 'N/A'}</span>
                                    <span className="stat-lbl">Rating</span>
                                </div>
                            </div>
                            <div className="side-stat">
                                <Clock size={20} className="clock-icon" />
                                <div>
                                    <span className="stat-val">{attraction.crowdLevel}</span>
                                    <span className="stat-lbl">Crowd</span>
                                </div>
                            </div>
                        </div>

                        <button className="primary-action-btn" onClick={handleFavorite} disabled={isFavoriting}>
                            <Heart size={20} fill={isFavoriting ? "currentColor" : "none"} />
                            <span>{isFavoriting ? 'Saving...' : 'Add to Collection'}</span>
                        </button>
                        
                        <button className="secondary-action-btn glass">
                            <Share2 size={20} />
                            <span>Share Discovery</span>
                        </button>
                    </div>

                    {/* DIRECTIONS */}
                    <div className="info-card glass">
                        <div className="card-header">
                            <Navigation size={18} />
                            <h3>Map Directions</h3>
                        </div>
                        <div className="directions-grid">
                            <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${attraction.latitude},${attraction.longitude}`}
                                target="_blank" rel="noopener noreferrer" className="nav-way google glass"
                            >
                                Google Maps
                            </a>
                            <a 
                                href={`https://yandex.com/maps/?rtext=~${attraction.latitude},${attraction.longitude}`}
                                target="_blank" rel="noopener noreferrer" className="nav-way yandex glass"
                            >
                                Yandex Maps
                            </a>
                        </div>
                    </div>

                    {/* WORKING HOURS */}
                    {attraction.workingHours && attraction.workingHours.length > 0 && (
                        <div className="info-card glass">
                            <div className="card-header">
                                <Clock size={18} />
                                <h3>Visiting Hours</h3>
                            </div>
                            <ul className="schedule-list">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, ix) => {
                                    const schedule = attraction.workingHours.find(h => h.dayOfWeek === (ix + 1) % 7);
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
                </aside>
            </div>

            <ReportReviewModal 
                isOpen={reportModal.isOpen}
                onClose={() => setReportModal({ isOpen: false, reviewId: null })}
                onSubmit={handleReportSubmit}
            />
        </div>
    );
};
