import React, { useState } from 'react';
import { useHotelReviews } from '../hooks/useHotelReviews';
import { Star, MessageCircle, User, ShieldCheck } from 'lucide-react';
import './ReviewSection.css';

interface ReviewSectionProps {
    hotelId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ hotelId }) => {
    const { reviews, loading, total, submitReview, fetchMore, page, totalPages } = useHotelReviews(hotelId);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [scores, setScores] = useState({
        cleanliness: 5,
        location: 5,
        staff: 5
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        try {
            await submitReview({
                rating,
                comment,
                cleanlinessScore: scores.cleanliness,
                locationScore: scores.location,
                staffScore: scores.staff
            });
            setSuccess(true);
            setShowForm(false);
            // Reset form
            setComment('');
            setRating(5);
            setScores({ cleanliness: 5, location: 5, staff: 5 });
        } catch (err: any) {
            setFormError(err.message || 'Failed to submit review. Ensure you have completed a stay at this hotel.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-section">
            <div className="review-header">
                <div className="review-stats">
                    <h2 className="section-title">Guest Reviews</h2>
                    <div className="total-reviews-badge">
                        <MessageCircle size={16} />
                        <span>{total} Reviews</span>
                    </div>
                </div>
                {!showForm && !success && (
                    <button onClick={() => setShowForm(true)} className="btn-outline">
                        Write a Review
                    </button>
                )}
            </div>

            {success && (
                <div className="alert-success">
                    <ShieldCheck size={20} />
                    <span>Your review has been submitted successfully!</span>
                    <button onClick={() => setSuccess(false)} className="close-btn">×</button>
                </div>
            )}

            {showForm && (
                <div className="review-form-card">
                    <h3>Share your experience</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="rating-selector">
                            <label>Overall Rating</label>
                            <div className="star-picker">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={32}
                                        fill={s <= rating ? "#f59e0b" : "transparent"}
                                        color={s <= rating ? "#f59e0b" : "#d1d5db"}
                                        onClick={() => setRating(s)}
                                        className="star-icon"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="scores-grid">
                            {['cleanliness', 'location', 'staff'].map((key) => (
                                <div key={key} className="score-item">
                                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={scores[key as keyof typeof scores]}
                                        onChange={(e) => setScores({ ...scores, [key]: parseInt(e.target.value) })}
                                    />
                                    <span>{scores[key as keyof typeof scores]}/5</span>
                                </div>
                            ))}
                        </div>

                        <div className="form-group">
                            <label>Your Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tell us about your stay..."
                                required
                            ></textarea>
                        </div>

                        {formError && <p className="error-text">{formError}</p>}

                        <div className="form-actions">
                            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                            <button type="submit" disabled={submitting} className="btn-primary">
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="reviews-list">
                {reviews.length === 0 && !loading && (
                    <div className="empty-reviews">
                        <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}

                {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                        <div className="review-user-info">
                            <div className="user-avatar">
                                <User size={20} />
                            </div>
                            <div className="user-details">
                                <span className="user-email">{review.user?.email || 'Guest User'}</span>
                                <span className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="review-stars-inline">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={14}
                                        fill={s <= review.rating ? "#f59e0b" : "transparent"}
                                        color={s <= review.rating ? "#f59e0b" : "#d1d5db"}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="review-content">
                            <p>{review.comment}</p>
                            {(review.cleanlinessScore || review.locationScore || review.staffScore) && (
                                <div className="review-scores-pill">
                                    {review.cleanlinessScore && <span>Clean: {review.cleanlinessScore}</span>}
                                    {review.locationScore && <span>Loc: {review.locationScore}</span>}
                                    {review.staffScore && <span>Staff: {review.staffScore}</span>}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && <div className="loading-spinner">Loading reviews...</div>}

                {page < totalPages && (
                    <button onClick={fetchMore} className="btn-load-more">
                        Load More Reviews
                    </button>
                )}
            </div>
        </div>
    );
};
