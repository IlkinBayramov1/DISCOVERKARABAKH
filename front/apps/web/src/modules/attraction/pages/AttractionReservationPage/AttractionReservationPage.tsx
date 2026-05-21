import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Info, Users, CreditCard, ChevronLeft, Calendar, User, Phone, Mail } from 'lucide-react';
import { useBooking } from '../../../booking/hooks/useBooking';
import { attractionApi } from '../../api/attraction.api';
import { useProfile } from '../../../account/hooks/useProfile';
import './AttractionReservationPage.css';

export const AttractionReservationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const attractionId = searchParams.get('attractionId');

    const [attraction, setAttraction] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [visitDate, setVisitDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');

    const { submitBooking, loading: bookingLoading, error: bookingError } = useBooking();
    const { profile } = useProfile();

    useEffect(() => {
        if (profile) {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setEmail(profile.email || '');
            setPhone(profile.phone || '');
        }
    }, [profile]);

    useEffect(() => {
        if (attractionId) {
            attractionApi.getAttractionById(attractionId).then(res => {
                setAttraction(res.data || res);
                setLoading(false);
            }).catch(() => {
                setLoading(false);
            });
        }
    }, [attractionId]);

    const isDateAvailable = (dateStr: string) => {
        if (!attraction?.workingHours) return true;
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay(); // 0 is Sunday
        const dayConfig = attraction.workingHours.find((h: any) => h.dayOfWeek === dayOfWeek);
        return dayConfig ? !dayConfig.isClosed : true;
    };

    const handleBooking = async () => {
        if (!visitDate) {
            alert('Please select a visit date');
            return;
        }

        if (!isDateAvailable(visitDate)) {
            alert('The attraction is closed on the selected date. Please choose another day.');
            return;
        }

        if (!firstName || !lastName || !email || !phone) {
            alert('Please fill out all contact details');
            return;
        }



        try {
            const data = await submitBooking({
                type: 'attraction',
                entityId: attraction.id,
                visitDate,
                participants: adults + children,
                items: [{
                    checkIn: visitDate,
                    checkOut: visitDate,
                    adults,
                    children
                }],
                paymentMethod,
                guests: [{
                    firstName,
                    lastName,
                    email,
                    phone
                }]
            });

            if (data && data.data?.id) {
                navigate(`/booking-confirmation/${data.data.id}`);
            }
        } catch (err) {
            console.error('Booking failed:', err);
        }
    };

    if (loading) {
        return (
            <div className="reservation-loading">
                <div className="spinner"></div>
                <p>Loading attraction details...</p>
            </div>
        );
    }

    if (!attraction) {
        return (
            <div className="reservation-error">
                <h2>Attraction Not Found</h2>
                <button onClick={() => navigate('/attractions')}>Back to Attractions</button>
            </div>
        );
    }

    const pricePerPerson = attraction.price || 0;
    const totalParticipants = adults + children;
    const totalAmount = pricePerPerson * totalParticipants;

    return (
        <div className="attraction-reservation-page">
            <div className="reservation-container">
                <button onClick={() => navigate(-1)} className="back-link">
                    <ChevronLeft size={20} /> Back to Details
                </button>

                <main className="reservation-content">
                    <div className="reservation-info">
                        <h1 className="page-title">Secure Your Visit</h1>
                        <p className="page-subtitle">Complete your reservation for {attraction.name}</p>

                        {bookingError && <div className="error-banner">{bookingError}</div>}

                        {/* Contact Form */}
                        <section className="reservation-section card">
                            <h2 className="section-title">
                                <User size={20} /> Lead Participant
                            </h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input 
                                        type="text" 
                                        value={firstName} 
                                        onChange={e => setFirstName(e.target.value)}
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input 
                                        type="text" 
                                        value={lastName} 
                                        onChange={e => setLastName(e.target.value)}
                                        placeholder="Enter last name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label><Mail size={16} /> Email Address</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label><Phone size={16} /> Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={phone} 
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="+994 -- --- -- --"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="reservation-section card">
                            <h2 className="title-icon">
                                <CreditCard /> Payment Method
                            </h2>
                            <div className="options">
                                <label className={`option ${paymentMethod === 'card' ? 'active' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        checked={paymentMethod === 'card'} 
                                        onChange={() => setPaymentMethod('card')}
                                    />
                                    <div className="option-content">
                                        <span className="option-name">DiscoverKarabakh Wallet</span>
                                        <span className="option-desc">Secure payment with SSL encryption</span>
                                    </div>
                                    <div className="card-icons">
                                        <span className="visa">VISA</span>
                                        <span className="mc">MC</span>
                                    </div>
                                </label>
                            </div>
                        </section>
                    </div>

                    <aside className="reservation-sidebar">
                        <div className="summary-card card sticky-sidebar">
                            <div className="attraction-brief">
                                <img 
                                    src={(attraction.images && attraction.images.length > 0) ? (attraction.images[0].url || attraction.images[0]) : 'https://placehold.co/600x400?text=Attraction'} 
                                    alt={attraction.name} 
                                    className="brief-image"
                                />
                                <div className="brief-details">
                                    <h3>{attraction.name}</h3>
                                    <p>{attraction.city}</p>
                                </div>
                            </div>

                            <div className="booking-config">
                                <div className="config-item">
                                    <label><Calendar size={16} /> Visit Date</label>
                                    <input 
                                        type="date" 
                                        value={visitDate} 
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={e => setVisitDate(e.target.value)}
                                        className={!isDateAvailable(visitDate) ? 'date-invalid' : ''}
                                    />
                                    {!isDateAvailable(visitDate) && (
                                        <p className="error-text">Attraction is closed on this day</p>
                                    )}
                                </div>

                                <div className="config-item">
                                    <label><Users size={16} /> Visitors</label>
                                    <div className="visitor-controls">
                                        <div className="visitor-row">
                                            <span>Adults</span>
                                            <div className="counter">
                                                <button onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
                                                <span>{adults}</span>
                                                <button onClick={() => setAdults(adults + 1)}>+</button>
                                            </div>
                                        </div>
                                        <div className="visitor-row">
                                            <span>Children</span>
                                            <div className="counter">
                                                <button onClick={() => setChildren(Math.max(0, children - 1))}>-</button>
                                                <span>{children}</span>
                                                <button onClick={() => setChildren(children + 1)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="price-breakdown">
                                <div className="price-row">
                                    <span>Base Ticket (₼{pricePerPerson}) x {totalParticipants}</span>
                                    <span>₼{totalAmount}</span>
                                </div>
                                <div className="price-total">
                                    <span>Total Amount</span>
                                    <span>₼{totalAmount}</span>
                                </div>
                            </div>

                            <button 
                                className="confirm-button" 
                                onClick={handleBooking}
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? (
                                    <div className="loader"></div>
                                ) : (
                                    <>
                                        <ShieldCheck size={20} />
                                        Complete Booking
                                    </>
                                )}
                            </button>

                            <p className="guarantee-text">
                                <Info size={14} /> Official Tickets & Secure Booking
                            </p>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
};
