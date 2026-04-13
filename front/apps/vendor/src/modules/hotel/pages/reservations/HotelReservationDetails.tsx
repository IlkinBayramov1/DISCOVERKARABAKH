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
    MapPin
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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

    const DataRow = ({ icon: Icon, label, value, colorClass = "" }: { icon: LucideIcon, label: string, value: string, colorClass?: string }) => (
        <div className="info-item">
            <span className="section-title !m-0 !mb-2 !border-0 !p-0">
                <Icon size={12} /> {label}
            </span>
            <span className={`value ${colorClass}`}>{value}</span>
        </div>
    );

    return (
        <div className="reservation-details-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
                <div className="flex justify-between items-start w-full">
                    <div>
                        <h3>Guest Intelligence</h3>
                        <span className="booking-num">Protocol ID: #{booking.bookingNumber}</span>
                    </div>
                    <button className="btn-close-drawer" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* STATUS HIGHLIGHT */}
            <div className={`status-banner ${booking.status}`}>
                {booking.status === 'confirmed' ? <CheckCircle size={18} /> : <Clock size={18} />}
                <span>Current Status: {booking.status === 'confirmed' ? 'System Confirmed' : 'Action Required'}</span>
            </div>

            <div className="drawer-body">
                {/* GUEST PROFILE CARD */}
                <section className="detail-section">
                    <h4 className="section-title"><User size={14} /> Guest Identity</h4>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                                {mainGuest?.firstName?.[0] || 'G'}
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-800">
                                    {mainGuest ? `${mainGuest.firstName} ${mainGuest.lastName}` : 'Guest User'}
                                </h4>
                                <span className="text-slate-400 font-bold text-sm">Primary Guest Portfolio</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <DataRow icon={Mail} label="Email Protocol" value={mainGuest?.email || booking.user?.email || 'N/A'} colorClass="value-with-icon" />
                            <DataRow icon={Phone} label="Verified Phone" value={mainGuest?.phone || 'N/A'} />
                        </div>
                    </div>
                </section>

                {/* STAY TIMELINE VISUAL */}
                <section className="detail-section">
                    <h4 className="section-title"><Calendar size={14} /> Stay Timeline</h4>
                    <div className="stay-banner">
                        <div className="date-block text-left">
                            <span className="label">Check In</span>
                            <span className="date">{checkIn}</span>
                        </div>
                        <div className="nights-count">{nights} {nights === 1 ? 'Night' : 'Nights'}</div>
                        <div className="date-block text-right">
                            <span className="label">Check Out</span>
                            <span className="date">{checkOut}</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                        <div className="flex items-center gap-3">
                            <MapPin size={18} className="text-blue-600" />
                            <span className="text-sm font-bold text-slate-600">{booking.hotel?.name || 'Assigned Property'}</span>
                        </div>
                        <div className="text-[12px] font-black text-blue-600 uppercase tracking-widest">
                            {firstItem?.adults} Adults {firstItem?.children ? `/ ${firstItem.children} CH` : ''}
                        </div>
                    </div>
                </section>

                {/* FINANCIAL PERSPECTIVE */}
                <section className="detail-section">
                    <h4 className="section-title"><CreditCard size={14} /> Price Architecture</h4>
                    <div className="price-breakdown">
                        <div className="price-row">
                            <span className="text-slate-500 font-bold">Standard Nightly Base</span>
                            <span className="font-bold text-slate-700">{booking.totalPrice.toLocaleString()} {booking.currency}</span>
                        </div>
                        <div className="price-row total">
                            <span className="font-black text-slate-900">Total Yield</span>
                            <span className="font-black text-emerald-600">{booking.totalPrice.toLocaleString()} {booking.currency}</span>
                        </div>
                    </div>
                    <div className={`mt-4 flex items-center gap-2 font-black text-[11px] uppercase tracking-widest ${booking.paymentStatus === 'captured' ? 'text-emerald-600' : 'text-amber-500'}`}>
                        {booking.paymentStatus === 'captured' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        Payment Vector: {booking.paymentStatus.toUpperCase()}
                    </div>
                </section>

                {/* STRATEGIC NOTES */}
                {booking.specialRequests && (
                    <section className="detail-section">
                        <h4 className="section-title"><FileText size={14} /> Intelligence Notes</h4>
                        <div className="bg-amber-50/50 border-l-4 border-amber-400 p-5 rounded-r-2xl text-sm font-medium text-amber-800 leading-relaxed italic">
                            "{booking.specialRequests}"
                        </div>
                    </section>
                )}
            </div>

            {/* ACTION CENTER */}
            {(booking.status === 'pending' || booking.status === 'draft' || booking.status === 'pending_payment') && (
                <div className="drawer-actions">
                    <button 
                        className="btn-reject-full" 
                        onClick={() => onStatusUpdate(booking.id, 'reject')}
                    >
                        Decline
                    </button>
                    <button 
                        className="btn-approve-full" 
                        onClick={() => onStatusUpdate(booking.id, 'approve')}
                    >
                        Approve Protocol
                    </button>
                </div>
            )}
        </div>
    );
};
