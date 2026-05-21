import React, { useEffect, useState } from 'react';
import { bookingApi } from '../../../../modules/booking/api/booking.api';
import { useNavigate } from 'react-router-dom';
import { 
    Calendar, MapPin, Tag, ChevronRight, 
    XCircle, Loader2, Compass, Building2, CreditCard,
    Car, Map
} from 'lucide-react';
import './TripsPage.css';

export const TripsPage: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await bookingApi.getMyBookings();
            setBookings(res.data || []);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Warning: Are you sure you want to cancel this booking?')) return;
        
        setCancelling(id);
        try {
            await bookingApi.cancelBooking(id);
            await fetchBookings(); 
        } catch (err) {
            alert('Failed to cancel booking. Please contact support.');
        } finally {
            setCancelling(null);
        }
    };

    if (loading) {
        return (
            <div className="dk-trips-layout">
                <div className="dk-trips-container">
                    <div className="dk-trips-loading">
                        <div className="spinner"></div>
                        <p>Loading your adventures...</p>
                    </div>
                </div>
            </div>
        );
    }

    const getTripIcon = (type: string) => {
        switch (type) {
            case 'hotel': return <Building2 size={16} />;
            case 'tour': return <Tag size={16} />;
            case 'attraction': return <Map size={16} />;
            case 'transfer': return <Car size={16} />;
            default: return <Compass size={16} />;
        }
    };

    return (
        <div className="dk-trips-layout">
            <div className="dk-trips-container">
                
                {/* HEADER */}
                <header className="dk-trips-header">
                    <div className="header-text">
                        <h1 className="dk-title">My Trips</h1>
                        <p className="dk-subtitle">View and manage your upcoming and past adventures in Karabakh.</p>
                    </div>
                </header>

                {/* CONTENT */}
                {bookings.length === 0 ? (
                    <div className="dk-trips-empty">
                        <div className="empty-icon-circle">
                            <Compass size={40} strokeWidth={1.5} />
                        </div>
                        <h2>No adventures found</h2>
                        <p>You haven't booked any trips yet. Explore our curated tours and premium hotels to start your journey!</p>
                        <button onClick={() => navigate('/tours')} className="dk-btn-ghost mt-6">
                            Explore Experiences
                        </button>
                    </div>
                ) : (
                    <div className="dk-trips-list">
                        {bookings.map((booking) => {
                            const details = booking.hotel || booking.tour || booking.attraction || booking.vehicle || {};
                            const checkInDate = booking.items?.[0] ? new Date(booking.items[0].checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBA';
                            
                            let title = details.name || details.title || 'Untitled Adventure';
                            if (booking.bookingType === 'transfer' && details.brand) {
                                title = `${details.brand} ${details.model}`;
                            }

                            // Resolve Image
                            let imgUrl = null;
                            if (details.images) {
                                const images = Array.isArray(details.images) ? details.images : 
                                             (typeof details.images === 'string' ? [details.images] : 
                                             (typeof details.images === 'object' ? Object.values(details.images) : []));
                                
                                if (images.length > 0) {
                                    imgUrl = typeof images[0] === 'string' ? images[0] : images[0]?.url;
                                }
                            }

                            return (
                                <div 
                                    key={booking.id} 
                                    className={`dk-trip-card premium-card ${booking.status === 'cancelled' ? 'cancelled-card' : ''}`}
                                    onClick={() => navigate(`/booking-confirmation/${booking.id}`)}
                                >
                                    
                                    {/* CARD IMAGE AREA */}
                                    <div className="dk-trip-image-box">
                                        {imgUrl ? (
                                            <img src={imgUrl} alt={title} className="trip-bg-img" />
                                        ) : (
                                            <div className="trip-placeholder-bg">
                                                <Compass size={32} opacity={0.2} />
                                            </div>
                                        )}
                                        <div className="trip-type-badge">
                                            {getTripIcon(booking.bookingType)}
                                            <span className="capitalize">{booking.bookingType}</span>
                                        </div>
                                    </div>

                                    {/* CARD DETAILS */}
                                    <div className="dk-trip-details">
                                        
                                        <div className="trip-top-row">
                                            <div>
                                                <h3 className="trip-title">{title}</h3>
                                                <p className="trip-location">
                                                    <MapPin size={14} /> {details.address || details.city || details.vendorCompany || 'Karabakh Region'}
                                                </p>
                                            </div>
                                            <span className={`dk-status-pill ${booking.status}`}>
                                                {booking.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="dk-trip-meta-grid">
                                            <div className="meta-item">
                                                <label>Booking ID</label>
                                                <span className="value-mono">#{booking.bookingNumber}</span>
                                            </div>
                                            <div className="meta-item">
                                                <label>Date</label>
                                                <span className="value-highlight"><Calendar size={14} /> {checkInDate}</span>
                                            </div>
                                            <div className="meta-item">
                                                <label>Total Price</label>
                                                <span className="value-price">
                                                    <CreditCard size={14} /> {booking.totalPrice} {booking.currency || '₼'}
                                                </span>
                                            </div>
                                            <div className="meta-item">
                                                <label>Payment</label>
                                                <span className={`capitalize ${booking.paymentStatus === 'captured' ? 'text-success' : 'text-warning'}`}>
                                                    {booking.paymentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        {/* ACTION ROW */}
                                        <div className="trip-action-row">
                                            <span className="view-details-text">
                                                View Receipt <ChevronRight size={16} />
                                            </span>
                                            
                                            {booking.status !== 'cancelled' && (
                                                <button 
                                                    onClick={(e) => handleCancel(booking.id, e)}
                                                    disabled={cancelling === booking.id}
                                                    className="btn-cancel-trip"
                                                >
                                                    {cancelling === booking.id ? (
                                                        <><Loader2 size={14} className="spin-icon" /> Cancelling...</>
                                                    ) : (
                                                        <><XCircle size={14} /> Cancel Booking</>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};