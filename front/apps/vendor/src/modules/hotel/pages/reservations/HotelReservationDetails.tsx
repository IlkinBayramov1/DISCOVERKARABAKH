import React from 'react';
import { 
    X, 
    User, 
    Phone, 
    Mail, 
    Calendar, 
    CreditCard, 
    Clock, 
    FileText, 
    CheckCircle, 
    AlertCircle,
    MapPin,
    Users
} from 'lucide-react';
import type { IBooking } from '../../types';

interface Props {
    booking: IBooking;
    onClose: () => void;
    onStatusUpdate: (id: string, action: 'approve' | 'reject') => void;
}

export const HotelReservationDetails: React.FC<Props> = ({ booking, onClose, onStatusUpdate }) => {
    const firstItem = booking.items && booking.items.length > 0 ? booking.items[0] : null;
    const checkIn = firstItem?.checkIn ? new Date(firstItem.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
    const checkOut = firstItem?.checkOut ? new Date(firstItem.checkOut).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

    // Calculate nights
    const nights = firstItem?.checkIn && firstItem?.checkOut 
        ? Math.ceil((new Date(firstItem.checkOut).getTime() - new Date(firstItem.checkIn).getTime()) / (1000 * 3600 * 24))
        : 0;

    const mainGuest = booking.guests && booking.guests.length > 0 ? booking.guests[0] : null;

    return (
        <div className="dk-res-modal-container" onClick={e => e.stopPropagation()}>
            
            {/* HEADER */}
            <div className="dk-res-modal-header">
                <div className="dk-res-modal-title-group">
                    <div className="dk-res-modal-icon-badge">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h2>Reservation Details</h2>
                        <p>Protocol ID: <strong className="text-slate-700">#{booking.bookingNumber}</strong></p>
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                            Created: {booking.createdAt ? new Date(booking.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </p>
                    </div>
                </div>
                <button className="dk-res-modal-close" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            {/* STATUS BANNER */}
            <div className={`dk-modal-status-banner ${booking.status}`}>
                <div className="status-icon-wrap">
                    {booking.status === 'confirmed' || booking.status === 'completed' ? <CheckCircle size={20} /> : 
                     booking.status === 'cancelled' ? <X size={20} /> : <Clock size={20} />}
                </div>
                <div className="status-text-wrap">
                    <span className="status-title">Current Status: {booking.status.replace('_', ' ').toUpperCase()}</span>
                    <span className="status-subtitle">
                        {booking.status === 'confirmed' ? 'System Confirmed & Locked' : 
                         booking.status === 'cancelled' ? 'This reservation has been voided' : 'Action Required by Management'}
                    </span>
                </div>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="dk-res-modal-body">
                
                {/* CARD 1: GUEST IDENTITY */}
                <div className="dk-res-modal-card">
                    <h4 className="dk-res-card-heading"><User size={16} /> Guest Identity</h4>
                    <div className="dk-guest-profile-box">
                        <div className="guest-avatar-large">
                            {mainGuest?.firstName?.[0] || booking.user?.email?.[0]?.toUpperCase() || 'G'}
                        </div>
                        <div className="guest-primary-info">
                            <h3>{mainGuest ? `${mainGuest.firstName} ${mainGuest.lastName}` : (booking.user?.firstName ? `${booking.user.firstName} ${booking.user.lastName || ''}` : 'Guest User')}</h3>
                            <span>Primary Guest Portfolio</span>
                        </div>
                    </div>
                    <div className="dk-guest-contact-grid">
                        <div className="contact-item">
                            <div className="contact-icon"><Mail size={14} /></div>
                            <div className="contact-data">
                                <label>Email Protocol</label>
                                <span>{mainGuest?.email || booking.user?.email || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-icon"><Phone size={14} /></div>
                            <div className="contact-data">
                                <label>Verified Phone</label>
                                <span>{mainGuest?.phone || booking.user?.phone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARD 2: STAY TIMELINE */}
                <div className="dk-res-modal-card">
                    <h4 className="dk-res-card-heading"><Calendar size={16} /> Stay Timeline & Details</h4>
                    
                    <div className="dk-timeline-visual">
                        <div className="time-block">
                            <span className="time-label">Check In</span>
                            <span className="time-value">{checkIn}</span>
                        </div>
                        <div className="time-connector">
                            <div className="line"></div>
                            <span className="nights-pill">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                            <div className="line"></div>
                        </div>
                        <div className="time-block text-right">
                            <span className="time-label">Check Out</span>
                            <span className="time-value">{checkOut}</span>
                        </div>
                    </div>

                    <div className="dk-stay-meta-grid">
                        <div className="meta-box">
                            <MapPin size={16} className="meta-icon" />
                            <div className="meta-data">
                                <label>Assigned Property</label>
                                <span>{booking.hotel?.name || 'Standard Property'}</span>
                            </div>
                        </div>
                        <div className="meta-box">
                            <Users size={16} className="meta-icon" />
                            <div className="meta-data">
                                <label>Capacity</label>
                                <span>{firstItem?.adults} Adults {firstItem?.children ? `, ${firstItem.children} Child` : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARD 3: FINANCIAL ARCHITECTURE */}
                <div className="dk-res-modal-card">
                    <h4 className="dk-res-card-heading"><CreditCard size={16} /> Price Architecture</h4>
                    <div className="dk-price-breakdown">
                        <div className="price-row">
                            <span className="price-label">Standard Nightly Base</span>
                            <span className="price-val">{booking.totalPrice.toLocaleString()} {booking.currency || '₼'}</span>
                        </div>
                        <div className="price-row total">
                            <span className="price-label">Total Yield</span>
                            <span className="price-val">{booking.totalPrice.toLocaleString()} {booking.currency || '₼'}</span>
                        </div>
                    </div>
                    
                    <div className={`dk-payment-status ${booking.paymentStatus === 'captured' ? 'success' : 'warning'}`}>
                        {booking.paymentStatus === 'captured' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        Payment Vector: {booking.paymentStatus.toUpperCase()}
                    </div>
                </div>

                {/* CARD 4: STRATEGIC NOTES */}
                {booking.specialRequests && (
                    <div className="dk-res-modal-card mb-0 bg-amber-50/50 border-amber-100">
                        <h4 className="dk-res-card-heading text-amber-700"><FileText size={16} /> Intelligence Notes</h4>
                        <p className="dk-special-request-text">"{booking.specialRequests}"</p>
                    </div>
                )}
            </div>

            {/* ACTION FOOTER */}
            {(booking.status === 'pending' || booking.status === 'draft' || booking.status === 'pending_payment') && (
                <div className="dk-res-modal-footer">
                    <button 
                        className="dk-btn-reject" 
                        onClick={() => onStatusUpdate(booking.id, 'reject')}
                    >
                        Decline Reservation
                    </button>
                    <button 
                        className="dk-btn-approve" 
                        onClick={() => onStatusUpdate(booking.id, 'approve')}
                    >
                        Approve Protocol
                    </button>
                </div>
            )}
        </div>
    );
};