import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, 
    Calendar as CalendarIcon, 
    Clock, 
    Ticket, 
    AlertCircle, 
    CheckCircle2,
    Info,
    ArrowRight
} from 'lucide-react';
import { bookingApi } from '../../../booking/api/booking.api';
import './AttractionBookingWidget.css';

interface AttractionBookingWidgetProps {
    attraction: any;
}

export const AttractionBookingWidget: React.FC<AttractionBookingWidgetProps> = ({ attraction }) => {
    const navigate = useNavigate();
    
    // Form States
    const [visitDate, setVisitDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Validation
    const isClosed = useMemo(() => {
        if (!visitDate) return false;
        const date = new Date(visitDate);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday...
        const schedule = attraction.workingHours?.find((h: any) => h.dayOfWeek === dayOfWeek);
        return schedule?.isClosed;
    }, [visitDate, attraction.workingHours]);

    const totalPrice = useMemo(() => {
        if (attraction.entryType === 'free') return 0;
        return (adults + children) * (attraction.price || 0);
    }, [adults, children, attraction.price, attraction.entryType]);

    const handleBooking = async () => {
        if (!visitDate) {
            setError('Zəhmət olmasa ziyarət tarixini seçin.');
            return;
        }
        if (isClosed) {
            setError('Bu tarixdə məkan qapalıdır.');
            return;
        }

        setIsBooking(true);
        setError(null);

        try {
            const payload = {
                type: 'attraction',
                entityId: attraction.id,
                items: [{
                    checkIn: visitDate,
                    checkOut: visitDate, // Attractions are usually single day
                    adults,
                    children
                }],
                guests: [], // Optional for now
                paymentMethod: 'onsite'
            };

            const res = await bookingApi.createBooking(payload as any);
            if (res.success) {
                setSuccess(true);
                setTimeout(() => navigate('/account/bookings'), 2000);
            }
        } catch (err: any) {
            setError(err.message || 'Rezervasiya zamanı xəta baş verdi.');
        } finally {
            setIsBooking(false);
        }
    };

    if (success) {
        return (
            <div className="booking-widget-success">
                <CheckCircle2 size={48} color="#22c55e" />
                <h3>Təbrik edirik!</h3>
                <p>Rezervasiyanız uğurla tamamlandı. Yönləndirilirsiniz...</p>
            </div>
        );
    }

    return (
        <div className="attraction-booking-widget">
            {/* Header / Price */}
            <div className="widget-header">
                <div className="price-tag">
                    {attraction.entryType === 'free' ? (
                        <span className="free-badge">PULSUZ GİRİŞ</span>
                    ) : (
                        <>
                            <span className="currency">₼</span>
                            <span className="amount">{attraction.price}</span>
                            <span className="unit">/ nəfər</span>
                        </>
                    )}
                </div>
                <div className="availability-status">
                    <span className="dot pulse"></span>
                    Rezervasiya Aktivdir
                </div>
            </div>

            <div className="widget-form">
                {/* Date Selection */}
                <div className="form-group">
                    <label><CalendarIcon size={16} /> Ziyarət Tarixi</label>
                    <div className={`date-input-wrapper ${isClosed ? 'error' : ''}`}>
                        <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                        />
                    </div>
                    {isClosed && (
                        <div className="input-error-msg">
                            <AlertCircle size={12} /> Bu tarixdə məkan qapalıdır.
                        </div>
                    )}
                </div>

                {/* Participants */}
                <div className="form-group">
                    <label><Users size={16} /> Ziyaratçilər</label>
                    <div className="participants-grid">
                        <div className="p-item">
                            <div className="p-label">Böyük</div>
                            <div className="p-counter">
                                <button onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
                                <span>{adults}</span>
                                <button onClick={() => setAdults(adults + 1)}>+</button>
                            </div>
                        </div>
                        <div className="p-item">
                            <div className="p-label">Uşaq</div>
                            <div className="p-counter">
                                <button onClick={() => setChildren(Math.max(0, children - 1))}>-</button>
                                <span>{children}</span>
                                <button onClick={() => setChildren(children + 1)}>+</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                {attraction.entryType === 'paid' && (
                    <div className="booking-summary">
                        <div className="summary-row">
                            <span>{adults + children} nəfər x ₼{attraction.price}</span>
                            <span>₼{totalPrice}</span>
                        </div>
                        <div className="summary-total">
                            <span>Cəmi Ödəniş</span>
                            <span>₼{totalPrice}</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-banner">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <button 
                    className="book-now-btn" 
                    onClick={handleBooking}
                    disabled={isBooking || isClosed || !visitDate}
                >
                    {isBooking ? 'Bron edilir...' : (
                        <>İndi Rezerv Et <ArrowRight size={18} /></>
                    )}
                </button>

                <p className="widget-footer-info">
                    <Clock size={12} /> Seçilmiş tarix üçün biletlər məhdud saydadır.
                </p>
            </div>
        </div>
    );
};
