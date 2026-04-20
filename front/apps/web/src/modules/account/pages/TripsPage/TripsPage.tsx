import React, { useEffect, useState } from 'react';
import { bookingApi } from '../../../../modules/booking/api/booking.api';
import { useNavigate } from 'react-router-dom';
import { 
    Calendar, MapPin, Tag, ChevronRight, 
    XCircle, Loader2, Plane, Compass, Building2, CreditCard 
} from 'lucide-react';
import './TripsPage.css'; // Yeni DK CSS faylı

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
            <div className="dk-trips-loading">
                <Loader2 className="spin-icon" size={48} />
                <p>Loading your adventures...</p>
            </div>
        );
    }

    return (
        <div className="dk-trips-layout">
            <div className="dk-trips-container">
                
                {/* HEADER */}
                <header className="dk-trips-header">
                    <div className="header-text">
                        <h1 className="dk-title">My Trips</h1>
                        <p className="dk-subtitle">View and manage your upcoming and past adventures in Karabakh.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/tours')} 
                        className="dk-btn-primary"
                    >
                        <Plane size={18} /> Book New Adventure
                    </button>
                </header>

                {/* CONTENT */}
                {bookings.length === 0 ? (
                    <div className="dk-trips-empty">
                        <div className="empty-icon-circle">
                            <Compass size={40} />
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
                            const isTour = booking.bookingType === 'tour';
                            const details = isTour ? (booking.Tour || booking.tour) : booking.hotel;
                            const checkInDate = booking.items?.[0] ? new Date(booking.items[0].checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBA';
                            const imgUrl = details?.images?.[0] || null;

                            return (
                                <div 
                                    key={booking.id} 
                                    className={`dk-trip-card ${booking.status === 'cancelled' ? 'cancelled-card' : ''}`}
                                    onClick={() => navigate(`/booking-confirmation/${booking.id}`)}
                                >
                                    
                                    {/* CARD IMAGE AREA */}
                                    <div className="dk-trip-image-box">
                                        {imgUrl ? (
                                            <img src={imgUrl} alt={details?.name} className="trip-bg-img" />
                                        ) : (
                                            <div className="trip-placeholder-bg" />
                                        )}
                                        <div className="trip-type-badge">
                                            {isTour ? <Tag size={16} /> : <Building2 size={16} />}
                                        </div>
                                    </div>

                                    {/* CARD DETAILS */}
                                    <div className="dk-trip-details">
                                        
                                        <div className="trip-top-row">
                                            <div>
                                                <h3 className="trip-title">{details?.name || 'Untitled Adventure'}</h3>
                                                <p className="trip-location">
                                                    <MapPin size={14} /> {details?.address || details?.city || 'Karabakh Region'}
                                                </p>
                                            </div>
                                            <span className={`dk-status-pill ${booking.status}`}>
                                                {booking.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="dk-trip-meta-grid">
                                            <div className="meta-item">
                                                <label>Booking ID</label>
                                                <span className="font-mono">{booking.bookingNumber}</span>
                                            </div>
                                            <div className="meta-item">
                                                <label>Date</label>
                                                <span className="flex items-center gap-1"><Calendar size={14} className="text-blue-500"/> {checkInDate}</span>
                                            </div>
                                            <div className="meta-item">
                                                <label>Total Yield</label>
                                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                                    <CreditCard size={14} /> {booking.totalPrice} {booking.currency || '₼'}
                                                </span>
                                            </div>
                                            <div className="meta-item">
                                                <label>Payment</label>
                                                <span className="capitalize">{booking.paymentStatus}</span>
                                            </div>
                                        </div>

                                        {/* ACTION ROW */}
                                        <div className="trip-action-row">
                                            <span className="view-details-text">
                                                View Complete Protocol <ChevronRight size={16} />
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