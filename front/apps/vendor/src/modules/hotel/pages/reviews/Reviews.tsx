import { useReviews } from '../../hooks/useReviews';
import { Star, MessageSquare } from 'lucide-react';
import './Reviews.css';

export default function Reviews() {
    const { reviews, loading, error } = useReviews(true);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1><MessageSquare size={24} className="heading-icon" /> Guest Reviews</h1>
                    <p>Read and analyze feedback from your visitors</p>
                </div>
            </div>

            {error && <div className="alert error">{error}</div>}

            <div className="dashboard-content">
                {loading ? (
                    <div className="loading-state"><div className="spinner"></div><p>Loading Reviews...</p></div>
                ) : reviews.length === 0 ? (
                    <div className="empty-state">
                        <MessageSquare size={48} className="empty-icon text-muted" />
                        <h3>No Reviews Yet</h3>
                        <p>Once your properties receive verified stays, reviews will populate here.</p>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {reviews.map(review => (
                            <div key={review.id} className="review-card glassmorphism-card">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <h4>{review.user.email.split('@')[0]}</h4>
                                        <div className="text-muted review-meta">
                                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                            <span className="bullet-separator">•</span>
                                            <strong>{review.hotel.name}</strong>
                                        </div>
                                    </div>
                                    <div className="review-rating">
                                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                                        <span>{review.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                {review.comment ? (
                                    <p className="review-comment">"{review.comment}"</p>
                                ) : (
                                    <p className="review-comment text-muted italic">No written comment provided.</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
