// TourReviews.tsx - Yenilənmiş versiya
import { MessageSquare, Star } from 'lucide-react';
import './TourReviews.css';

export default function TourReviews() {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>Guest Reviews</h1>
                    <p>See what travelers have to say about your tours</p>
                </div>
            </div>

            <div className="glassmorphism-card">
                <MessageSquare size={48} />
                <h3>No Reviews Yet</h3>
                <p>Reviews from travelers who completed your tours will be shown here.</p>
                
                <div className="rating-preview">
                    <div className="star-row">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} size={24} />
                        ))}
                    </div>
                    <p>Your overall rating will be calculated once you receive reviews.</p>
                </div>
            </div>
        </div>
    );
}