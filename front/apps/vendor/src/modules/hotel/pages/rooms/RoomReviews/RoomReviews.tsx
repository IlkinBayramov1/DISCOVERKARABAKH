import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Star, Info } from 'lucide-react';
import './RoomReviews.css';

export default function RoomReviews() {
    const navigate = useNavigate();

    return (
        <div className="room-reviews-container">
            <div className="dashboard-header mb-2">
                <div>
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1><MessageSquare size={24} className="heading-icon" /> Room Reviews</h1>
                    <p>Manage customer feedback and ratings left for your rooms.</p>
                </div>
            </div>

            <div className="glassmorphism-card empty-reviews-placeholder">
                <div className="placeholder-content">
                    <div className="icon-circle">
                        <Star size={40} className="star-icon" />
                    </div>
                    <h3>Coming Soon...</h3>
                    <p>The review management module is currently being configured.</p>
                    
                    <div className="info-box">
                        <Info size={16} />
                        <span>You can continue managing your room settings for now.</span>
                    </div>

                    <button className="btn-secondary" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
