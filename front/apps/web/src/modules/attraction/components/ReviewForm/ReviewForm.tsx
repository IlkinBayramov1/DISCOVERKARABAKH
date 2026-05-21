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
        <form className="premium-review-form" onSubmit={handleSubmit}>
            {error && <div className="review-error-box">{error}</div>}
            
            <div className="rating-selector-premium">
                <div className="stars-interactive">
                    {[1, 2, 3, 4, 5].map(num => (
                        <button 
                            key={num}
                            type="button"
                            className={`star-btn ${rating >= num ? 'active' : ''}`}
                            onClick={() => setRating(num)}
                        >
                            ★
                        </button>
                    ))}
                </div>
                <span className="rating-label-text">
                    {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'}
                </span>
            </div>

            <div className="form-group-premium">
                <textarea 
                    placeholder="Share your experience (optional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                />
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-btn-premium">
                {isSubmitting ? 'Posting...' : 'Post Review'}
            </button>
        </form>
    );
};