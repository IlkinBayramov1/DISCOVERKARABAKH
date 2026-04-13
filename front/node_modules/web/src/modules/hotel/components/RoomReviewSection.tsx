import React, { useState } from 'react';
import { useRoomReviews } from '../hooks/useRoomReviews';
import { Star, MessageCircle, User, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import './RoomReviewSection.css';

interface RoomReviewSectionProps {
    hotelId: string;
    roomId: string;
}

export const RoomReviewSection: React.FC<RoomReviewSectionProps> = ({ hotelId, roomId }) => {
    const { reviews, loading, total, submitReview, fetchMore, page, totalPages } = useRoomReviews(hotelId, roomId);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        try {
            await submitReview({ rating, comment });
            setSuccess(true);
            setShowForm(false);
            setComment('');
            setRating(5);
        } catch (err: any) {
            setFormError(err.message || 'Failed to submit room review. You might have already reviewed it.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="room-review-container">
            <button
                className="room-review-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    <span>Room Reviews ({total})</span>
                </div>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isExpanded && (
                <div className="room-review-content">
                    <div className="room-review-actions">
                        {!showForm && !success && (
                            <button onClick={() => setShowForm(true)} className="btn-review-outline">
                                Write a Review
                            </button>
                        )}
                    </div>

                    {success && (
                        <div className="alert-success-small">
                            <ShieldCheck size={16} />
                            <span>Review submitted!</span>
                            <button onClick={() => setSuccess(false)} className="close-btn">×</button>
                        </div>
                    )}

                    {showForm && (
                        <div className="room-review-form">
                            <form onSubmit={handleSubmit}>
                                <div className="rating-simple">
                                    <label>Rating</label>
                                    <div className="star-picker-small">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={24}
                                                fill={s <= rating ? "#f59e0b" : "transparent"}
                                                color={s <= rating ? "#f59e0b" : "#d1d5db"}
                                                onClick={() => setRating(s)}
                                                className="cursor-pointer hover:scale-110 transition-transform"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group-small">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="How was the room?"
                                        required
                                        className="review-textarea"
                                    ></textarea>
                                </div>

                                {formError && <p className="error-text-small">{formError}</p>}

                                <div className="form-actions-small">
                                    <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">Cancel</button>
                                    <button type="submit" disabled={submitting} className="btn-submit">
                                        {submitting ? '...' : 'Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="room-reviews-list">
                        {reviews.length === 0 && !loading && (
                            <div className="empty-reviews-small">No reviews yet.</div>
                        )}

                        {reviews.map((review) => (
                            <div key={review.id} className="room-review-item">
                                <div className="rr-header">
                                    <User size={14} className="text-gray-400" />
                                    <span className="rr-email">{review.user?.email || 'Guest'}</span>
                                    <span className="rr-date">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="rr-stars">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={12}
                                                fill={s <= review.rating ? "#f59e0b" : "transparent"}
                                                color="#f59e0b"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="rr-comment">{review.comment}</p>
                            </div>
                        ))}

                        {loading && <div className="loading-small">Loading...</div>}

                        {page < totalPages && (
                            <button onClick={fetchMore} className="btn-load-more-small">
                                Load More
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
