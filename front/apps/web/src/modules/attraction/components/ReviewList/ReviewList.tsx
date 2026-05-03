import React from 'react';
import { Star, Flag, MessageCircle } from 'lucide-react';
import type { AttractionReview } from '../../types';
import './ReviewList.css';

interface ReviewListProps {
    reviews: AttractionReview[];
    isLoading?: boolean;
    onReport?: (reviewId: string) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading, onReport }) => {
    if (isLoading) {
        return <div className="loading-reviews glass">Discovery voices are arriving...</div>;
    }

    if (reviews.length === 0) {
        return <div className="no-reviews glass">No stories shared yet. Be the first to capture the moment!</div>;
    }

    return (
        <div className="review-list">
            {reviews.map(review => (
                <div key={review.id} className="review-card glass">
                    <div className="review-header">
                        <div className="reviewer">
                            <div className="avatar">
                                {review.user.firstName?.charAt(0) || '?'}
                            </div>
                            <div className="reviewer-info">
                                <h5>{review.user.firstName || 'Anonymous'} {review.user.lastName || ''}</h5>
                                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="review-actions">
                            <div className="rating-pill">
                                <Star size={14} fill="currentColor" />
                                <span>{review.rating}</span>
                            </div>
                            {onReport && (
                                <button 
                                    className="report-btn" 
                                    onClick={() => onReport(review.id)}
                                    title="Report inappropriate content"
                                >
                                    <Flag size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {review.comment && (
                        <p className="review-text">{review.comment}</p>
                    )}

                    {review.images && review.images.length > 0 && (
                        <div className="review-images">
                            {review.images.map((img, i) => (
                                <img key={i} src={img} alt="User review" className="glass-hover" />
                            ))}
                        </div>
                    )}
                    
                    {review.vendorReply && (
                        <div className="vendor-reply-box glass mt-4">
                            <div className="reply-header">
                                <MessageCircle size={14} className="reply-icon" />
                                <span>Vendor's Message</span>
                            </div>
                            <p className="reply-text">{review.vendorReply}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
