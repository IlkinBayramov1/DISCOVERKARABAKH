import React, { useState } from 'react';
import './ReviewForm.css';

interface ReviewFormProps {
    onSubmit: (rating: number, comment?: string) => Promise<{ success: boolean; error?: string }>;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const result = await onSubmit(rating, comment);
        
        if (result.success) {
            setRating(5);
            setComment('');
        } else {
            setError(result.error || 'Something went wrong');
        }
        
        setIsSubmitting(false);
    };

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <h3>Leave a Review</h3>
            
            {error && <div className="review-error">{error}</div>}
            
            <div className="rating-selector">
                <label>Rating:</label>
                <div className="stars">
                    {[1, 2, 3, 4, 5].map(num => (
                        <button 
                            key={num}
                            type="button"
                            className={`star ${rating >= num ? 'active' : ''}`}
                            onClick={() => setRating(num)}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <textarea 
                    placeholder="Share your experience (optional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                />
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? 'Posting...' : 'Post Review'}
            </button>
        </form>
    );
};
