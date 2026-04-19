import { CalendarCheck, Search, Filter, User, Calendar, Tag, CreditCard } from 'lucide-react';
import { useTourBookings } from '../../hooks/useTourBookings';
import './TourBookings.css';

export default function TourBookings() {
    const { bookings, loading, error } = useTourBookings();

    if (loading) return (
        <div className="dashboard-container">
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading bookings...</p>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>Tour Bookings</h1>
                    <p>Manage reservations for your experiences</p>
                </div>
            </div>

            {error && <div className="alert error">{error}</div>}

            {bookings.length === 0 ? (
                <div className="glassmorphism-card">
                    <CalendarCheck size={48} />
                    <h3>No Bookings Yet</h3>
                    <p>When customers book your tours, they will appear here.</p>
                </div>
            ) : (
                <div className="booking-list">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="glassmorphism-card booking-item-card">
                            <div className="booking-main-info">
                                <div className="booking-status">
                                    <span className={`status-pill ${booking.status}`}>{booking.status}</span>
                                </div>
                                <h2>#{booking.bookingNumber}</h2>
                                <div className="booking-meta-row">
                                    <div className="meta-box">
                                        <Tag size={16} />
                                        <span>{booking.Tour?.name || 'Experience'}</span>
                                    </div>
                                    <div className="meta-box">
                                        <Calendar size={16} />
                                        <span>{new Date(booking.items?.[0]?.checkIn).toLocaleDateString()}</span>
                                    </div>
                                    <div className="meta-box">
                                        <User size={16} />
                                        <span>{booking.items?.[0]?.adults + (booking.items?.[0]?.children || 0)} pax</span>
                                    </div>
                                    <div className="meta-box">
                                        <CreditCard size={16} />
                                        <span className="price-tag">₼{booking.totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="booking-customer-info">
                                <h3>Customer: {booking.user?.email}</h3>
                                {booking.specialRequests && (
                                    <div className="special-requests">
                                        <strong>Note:</strong> {booking.specialRequests}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}