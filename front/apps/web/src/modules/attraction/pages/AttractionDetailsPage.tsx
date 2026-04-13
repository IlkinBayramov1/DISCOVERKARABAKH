import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAttraction } from '../hooks/useAttraction';
import { useAttractionReviews } from '../hooks/useAttractionReviews';
import { ReviewList } from '../components/ReviewList';
import { ReviewForm } from '../components/ReviewForm';
import { getToken } from '../../../shared/utils/token';
import { attractionApi } from '../api/attraction.api';
import './AttractionDetailsPage.css';

export const AttractionDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const { attraction, isLoading, error } = useAttraction(id);
    const { 
        reviews, 
        isLoading: isReviewsLoading, 
        submitReview 
    } = useAttractionReviews(attraction?.id);

    const [isFavoriting, setIsFavoriting] = useState(false);
    const isAuthenticated = !!getToken();

    const handleFavorite = async () => {
        if (!isAuthenticated) {
            navigate('/auth/login', { state: { returnUrl: `/attractions/${id}` } });
            return;
        }

        if (!attraction?.id) return;

        setIsFavoriting(true);
        try {
            await attractionApi.toggleFavorite(attraction.id, getToken()!);
            // Ideally, we'd update a local state or refetch to show filled heart depending on generic endpoint return
            alert('Favorites toggled!'); // Placeholder UI feedback
        } catch (err) {
            console.error('Failed to toggle favorite');
        } finally {
            setIsFavoriting(false);
        }
    };

    if (isLoading) {
        return <div className="loading-screen">Loading Attraction Details...</div>;
    }

    if (error || !attraction) {
        return (
            <div className="error-screen">
                <h2>Oops!</h2>
                <p>{error || 'Attraction not found.'}</p>
                <button onClick={() => navigate('/attractions')}>Back to Attractions</button>
            </div>
        );
    }

    const coverImage = attraction.images?.find(img => img.isCover)?.url 
        || attraction.images?.[0]?.url 
        || 'https://images.unsplash.com/photo-1549558549-415fe4c37b60?auto=format&fit=crop&q=80&w=2000';

    return (
        <div className="attraction-details-page">
            <div 
                className="details-hero"
                style={{ backgroundImage: `linear-gradient(rgba(11, 15, 25, 0.4), #0B0F19), url(${coverImage})` }}
            >
                <div className="hero-content">
                    <div className="badges">
                        {attraction.isFeatured && <span className="badge featured">Premium</span>}
                        {attraction.category && <span className="badge category">{attraction.category.name}</span>}
                    </div>
                    <h1>{attraction.name}</h1>
                    <p className="location">📍 {attraction.city || 'Karabakh'} • {attraction.address}</p>
                </div>
            </div>

            <div className="details-container">
                <div className="details-main">
                    <section className="about-section">
                        <h2>About This Attraction</h2>
                        <p className="description">{attraction.description}</p>
                    </section>
                    
                    {attraction.images && attraction.images.length > 1 && (
                        <section className="gallery-section">
                            <h2>Gallery</h2>
                            <div className="gallery-grid">
                                {attraction.images.filter(img => !img.isCover).slice(0, 4).map(img => (
                                    <img key={img.id} src={img.url} alt={`Gallery ${attraction.name}`} />
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="reviews-section">
                        <h2>Reviews ({reviews.length})</h2>
                        <ReviewList reviews={reviews} isLoading={isReviewsLoading} />
                        
                        <div className="review-form-container">
                            {isAuthenticated ? (
                                <ReviewForm onSubmit={submitReview} />
                            ) : (
                                <div className="login-prompt">
                                    <p>Please log in to leave a review.</p>
                                    <button onClick={() => navigate('/auth/login')}>Log In</button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <aside className="details-sidebar">
                    <div className="info-card">
                        <div className="price-block">
                            <span className="label">Entry Fee</span>
                            {attraction.entryType === 'free' ? (
                                <span className="value free">Free</span>
                            ) : (
                                <span className="value">₼ {attraction.price}</span>
                            )}
                        </div>

                        <div className="stat-block">
                            <span className="label">Rating</span>
                            <span className="value rating">
                                ⭐ {attraction.stats?.averageRating ? attraction.stats.averageRating.toFixed(1) : 'New'}
                            </span>
                        </div>

                        <div className="stat-block">
                            <span className="label">Crowd Level</span>
                            <span className={`value crowd ${attraction.crowdLevel}`}>
                                {attraction.crowdLevel.charAt(0).toUpperCase() + attraction.crowdLevel.slice(1)}
                            </span>
                        </div>

                        <button 
                            className="favorite-btn" 
                            onClick={handleFavorite}
                            disabled={isFavoriting}
                        >
                            {isFavoriting ? '...' : '❤️ Add to Favorites'}
                        </button>
                    </div>

                    {attraction.workingHours && attraction.workingHours.length > 0 && (
                        <div className="info-card schedule-card">
                            <h3>Opening Hours</h3>
                            <ul className="schedule-list">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, ix) => {
                                    // Assuming dayOfWeek matches standard 1-7 or 0-6 indexing (using 1-based ISO typical)
                                    const schedule = attraction.workingHours.find(h => h.dayOfWeek === ix + 1);
                                    return (
                                        <li key={day} className={schedule?.isClosed ? 'closed' : ''}>
                                            <span className="day">{day}</span>
                                            <span className="hours">
                                                {schedule?.isClosed ? 'Closed' : (schedule?.openTime ? `${schedule.openTime} - ${schedule.closeTime}` : 'N/A')}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};
