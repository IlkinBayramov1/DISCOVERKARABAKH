import { useEffect } from 'react';
import { 
    X, User, Phone, Mail, Calendar, CreditCard, 
    Clock, FileText, CheckCircle, AlertCircle, MapPin, Users, Ticket
} from 'lucide-react';
import './AttractionBookingDetails.css'; 

interface Props {
    booking: any;
    onClose: () => void;
    onStatusUpdate: (id: string, action: 'approve' | 'reject') => void;
}

export default function AttractionBookingDetails({ booking, onClose, onStatusUpdate }: Props) {
    const firstItem = booking.items && booking.items.length > 0 ? booking.items[0] : null;
    const bookingDate = firstItem?.checkIn ? new Date(firstItem.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
    const mainGuest = booking.guests && booking.guests.length > 0 ? booking.guests[0] : null;
    
    const relatedAttraction = booking.attraction || booking.Attraction;
    const attractionName = relatedAttraction?.name || firstItem?.name || firstItem?.title || 'Unnamed Attraction';
    const totalGuests = (firstItem?.adults || 0) + (firstItem?.children || 0);

    // Scroll Lock
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    return (
        <div className="dk-res-modal-overlay" onClick={onClose}>
            <div className="dk-res-modal-container" onClick={e => e.stopPropagation()}>
                
                <div className="dk-res-modal-header">
                    <div className="dk-res-modal-title-group">
                        <div className="dk-res-modal-icon-badge">
                            <Ticket size={20} />
                        </div>
                        <div>
                            <h2>Attraction Pass</h2>
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

                <div className={`dk-modal-status-banner ${booking.status}`}>
                    <div className="status-icon-wrap">
                        {booking.status === 'confirmed' || booking.status === 'completed' ? <CheckCircle size={20} /> : 
                         booking.status === 'cancelled' ? <X size={20} /> : <Clock size={20} />}
                    </div>
                    <div className="status-text-wrap">
                        <span className="status-title">Current Status: {booking.status.replace('_', ' ').toUpperCase()}</span>
                        <span className="status-subtitle">
                            {booking.status === 'confirmed' ? 'Pass Validated & Confirmed' : 
                             booking.status === 'cancelled' ? 'This entry pass has been voided' : 'Action Required by Gatekeeper'}
                        </span>
                    </div>
                </div>

                <div className="dk-res-modal-body">
                    
                    <div className="dk-res-modal-card">
                        <h4 className="dk-res-card-heading"><User size={16} /> Guest Identity</h4>
                        <div className="dk-guest-profile-box">
                            <div className="guest-avatar-large">
                                {mainGuest?.firstName?.[0] || booking.user?.email?.[0]?.toUpperCase() || 'G'}
                            </div>
                            <div className="guest-primary-info">
                                <h3>{mainGuest ? `${mainGuest.firstName} ${mainGuest.lastName}` : (booking.user?.firstName ? `${booking.user.firstName} ${booking.user.lastName || ''}` : 'Guest User')}</h3>
                                <span>Primary Pass Holder</span>
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

                    <div className="dk-res-modal-card">
                        <h4 className="dk-res-card-heading"><Calendar size={16} /> Entry Information</h4>
                        
                        <div className="dk-stay-meta-grid mb-4">
                            <div className="meta-box" style={{ gridColumn: 'span 2' }}>
                                <MapPin size={16} className="meta-icon" />
                                <div className="meta-data">
                                    <label>Selected Venue</label>
                                    <span className="text-[15px]">{attractionName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="dk-stay-meta-grid">
                            <div className="meta-box">
                                <Calendar size={16} className="meta-icon" />
                                <div className="meta-data">
                                    <label>Entry Date</label>
                                    <span>{bookingDate}</span>
                                </div>
                            </div>
                            <div className="meta-box">
                                <Users size={16} className="meta-icon" />
                                <div className="meta-data">
                                    <label>Pass Count</label>
                                    <span>{totalGuests} Visitors ({firstItem?.adults}A, {firstItem?.children || 0}C)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dk-res-modal-card">
                        <h4 className="dk-res-card-heading"><CreditCard size={16} /> Financial Architecture</h4>
                        <div className="dk-price-breakdown">
                            <div className="price-row total">
                                <span className="price-label">Transaction Value</span>
                                <span className="price-val">{booking.totalPrice.toLocaleString()} {booking.currency || '₼'}</span>
                            </div>
                        </div>
                        <div className={`dk-payment-status mt-4 ${booking.paymentStatus === 'captured' ? 'success' : 'warning'}`}>
                            {booking.paymentStatus === 'captured' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                            Payment Status: {booking.paymentStatus.toUpperCase()}
                        </div>
                    </div>

                    {booking.specialRequests && (
                        <div className="dk-res-modal-card mb-0 bg-amber-50/50 border-amber-100">
                            <h4 className="dk-res-card-heading text-amber-700"><FileText size={16} /> Gate Notes</h4>
                            <p className="dk-special-request-text">"{booking.specialRequests}"</p>
                        </div>
                    )}
                </div>

                {(booking.status === 'pending' || booking.status === 'draft' || booking.status === 'pending_payment') && (
                    <div className="dk-res-modal-footer">
                        <button className="dk-btn-reject" onClick={() => onStatusUpdate(booking.id, 'reject')}>
                            Deny Access
                        </button>
                        <button className="dk-btn-approve" onClick={() => onStatusUpdate(booking.id, 'approve')}>
                            Validate Entry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
