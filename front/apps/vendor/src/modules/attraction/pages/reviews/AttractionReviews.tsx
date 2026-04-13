import { useState, useEffect } from 'react';
import { vendorAttractionApi } from '../../api/attraction.api';
import type { AttractionReview, Attraction } from '../../types';
import './AttractionReviews.css';

export default function AttractionReviews() {
    const [reviews, setReviews] = useState<AttractionReview[]>([]);
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [selectedAttractionId, setSelectedAttractionId] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Load vendor's attractions for filter dropdown
            const attrRes = await vendorAttractionApi.getAttractions();
            setAttractions(attrRes.data || []);

            // Load reviews
            const revRes = await vendorAttractionApi.getReviews(
                selectedAttractionId === 'all' ? undefined : selectedAttractionId
            );
            setReviews(revRes.data || []);
        } catch (error) {
            console.error('Failed to load reviews data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedAttractionId]);

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return (
        <div className="attraction-reviews-page">
            <div className="page-header">
                <div>
                    <h1>Attraction Reviews</h1>
                    <p>Read what tourists are saying about your experiences.</p>
                </div>
                
                <div className="filter-dropdown">
                    <select 
                        value={selectedAttractionId} 
                        onChange={(e) => setSelectedAttractionId(e.target.value)}
                    >
                        <option value="all">All Attractions</option>
                        {attractions.map(attr => (
                            <option key={attr.id} value={attr.id}>{attr.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="reviews-summary-card">
                <div className="summary-stat">
                    <span className="big-number">{averageRating.toFixed(1)}</span>
                    <span className="stars">
                        {'★'.repeat(Math.round(averageRating))}
                        {'☆'.repeat(5 - Math.round(averageRating))}
                    </span>
                    <span className="label">Average Rating</span>
                </div>
                <div className="summary-stat">
                    <span className="big-number">{reviews.length}</span>
                    <span className="label">Total Reviews</span>
                </div>
            </div>

            <div className="reviews-list-container">
                {isLoading ? (
                    <div className="loading-state">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="empty-state">
                        <p>No reviews found for the selected attraction.</p>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {reviews.map(review => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <div className="reviewer">
                                        <div className="avatar">
                                            {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                                        </div>
                                        <div>
                                            <h4>{review.user?.firstName} {review.user?.lastName}</h4>
                                            <span className="date">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="rating">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                </div>
                                <div className="review-content">
                                    {review.comment ? (
                                        <p>{review.comment}</p>
                                    ) : (
                                        <p className="no-comment"><i>No written feedback provided.</i></p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
