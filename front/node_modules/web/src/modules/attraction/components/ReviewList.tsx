import React from 'react';
import type { AttractionReview } from '../types';
import './ReviewList.css';

interface ReviewListProps {
    reviews: AttractionReview[];
    isLoading?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading }) => {
    if (isLoading) {
        return <div className="loading-reviews">Loading reviews...</div>;
    }

    if (reviews.length === 0) {
        return <div className="no-reviews">No reviews yet. Be the first!</div>;
    }

    return (
        <div className="review-list">
            {reviews.map(review => (
                <div key={review.id} className="review-item">
                    <div className="review-header">
                        <div className="reviewer-info">
                            <div className="avatar">
                                {review.user.firstName.charAt(0)}{review.user.lastName.charAt(0)}
                            </div>
                            <div>
                                <h4>{review.user.firstName} {review.user.lastName}</h4>
                                <span className="date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="review-rating">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                    </div>
                    {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                    )}
                </div>
            ))}
        </div>
    );
};
