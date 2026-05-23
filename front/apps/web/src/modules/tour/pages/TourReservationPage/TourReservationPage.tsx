import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, CreditCard, ChevronLeft, User as UserIcon, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useBooking } from '../../../booking/hooks/useBooking';
import { tourWebApi } from '../../api/tour.api';
import { useTourAvailability } from '../../hooks/useTourAvailability';
import type { ITour } from '../../types';
import { useProfile } from '../../../account/hooks/useProfile';
import { WalletPaymentBox } from '../../../booking/components/WalletPaymentBox';
import { useAuth } from '../../../../shared/context/AuthContext';
import './TourReservationPage.css';

export const TourReservationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const tourId = searchParams.get('tourId');

    const [tour, setTour] = useState<ITour | null>(null);
    const [loadingTour, setLoadingTour] = useState(true);

    const [participants, setParticipants] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');

    const [isValidWallet, setIsValidWallet] = useState(true);
    const { refreshUser } = useAuth();

    const { submitBooking, loading: bookingLoading, error: bookingError } = useBooking();
    const { profile } = useProfile();

    useEffect(() => {
        if (profile) {
            if (!firstName) setFirstName(profile.firstName || '');
            if (!lastName) setLastName(profile.lastName || '');
            if (!email) setEmail(profile.email || '');
            if (!phone) setPhone(profile.phone || '');
        }
    }, [profile]);

    const { availability, loading: availabilityLoading, checkAvailability } = useTourAvailability();
    const dateParam = searchParams.get('date');

    useEffect(() => {
        if (tourId && dateParam) {
            checkAvailability(tourId, dateParam);
        }
    }, [tourId, dateParam, checkAvailability]);

    useEffect(() => {
        if (tourId) {
            tourWebApi.getTourById(tourId).then(res => {
                const fetchedTour = (res as any).data || res;
                setTour(fetchedTour);
                setLoadingTour(false);
            }).catch(() => {
                setLoadingTour(false);
            });
        } else {
            setLoadingTour(false);
        }
    }, [tourId]);

    const handleBooking = async () => {
        const selectedDate = dateParam || tour?.startDate;
        if (!tourId || !firstName || !lastName || !email || !phone || !selectedDate) {
            alert('Please fill out all required details');
            return;
        }

        if (!isValidWallet) {
            alert('Balansınızda kifayət qədər vəsait yoxdur.');
            return;
        }

        try {
            const data = await submitBooking({
                type: 'tour',
                entityId: tourId,
                tourDate: selectedDate,
                participants: participants,
                items: [{
                    checkIn: selectedDate,
                    checkOut: selectedDate,
                    adults: participants,
                    children: 0
                }],
                guests: [{
                    firstName,
                    lastName,
                    email,
                    phone
                }],
                paymentMethod
            });

            if (data && data.data?.id) {
                await refreshUser();
                navigate(`/booking-confirmation/${data.data.id}`);
            }
        } catch (err: any) {
            alert(err.message || 'Booking failed');
            await refreshUser();
        }
    };

    if (loadingTour || (dateParam && availabilityLoading && !availability)) {
        return (
            <div className="reservation-loading">
                <div className="spinner"></div>
                <p>Preparing your secure checkout...</p>
            </div>
        );
    }

    if (!tourId || !tour) {
        return (
            <div className="reservation-loading" style={{ flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Invalid Booking Request</h2>
                <p style={{ color: '#64748b' }}>We couldn't find the tour you selected.</p>
                <button onClick={() => navigate('/tours')} className="confirm-button" style={{ maxWidth: '200px' }}>Back to Tours</button>
            </div>
        );
    }

    const pricePerPerson = availability?.price ?? tour.pricePerPerson;
    const netTotal = pricePerPerson * participants;
    const selectedDateStr = dateParam ? new Date(dateParam).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : (tour.startDate ? new Date(tour.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A');

    return (
        <div className="reservation-page">
            <div className="reservation-container">
                <button onClick={() => navigate(-1)} className="back-link">
                    <ChevronLeft size={20} /> Back to Tour Details
                </button>

                <main className="reservation-content">
                    {/* LEFT COLUMN: FORMS */}
                    <div className="reservation-main-info">
                        <h1 className="page-title">Secure Your Adventure</h1>
                        <p className="page-subtitle">Verify your details and complete your booking.</p>

                        {bookingError && <div className="error-banner">{bookingError}</div>}

                        {/* Contact Info */}
                        <section className="reservation-section card">
                            <h2 className="title-icon">
                                <UserIcon size={20} /> Lead Traveler Details
                            </h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. John" 
                                        value={firstName} onChange={e => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Doe"
                                        value={lastName} onChange={e => setLastName(e.target.value)} 
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label><Mail size={16} /> Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="Confirmation goes here" 
                                        value={email} onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label><Phone size={16} /> Phone Number</label>
                                    <input 
                                        type="text" 
                                        placeholder="+994 -- --- -- --" 
                                        value={phone} onChange={e => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Payment Info */}
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
                            <WalletPaymentBox totalPrice={netTotal} onValidationChange={setIsValidWallet} />
                        </section>
                    </div>

                    {/* RIGHT COLUMN: PRICING ENGINE WIDGET */}
                    <aside className="reservation-sidebar">
                        <div className="summary-card card sticky-sidebar">
                            
                            <div className="hotel-brief">
                                <img src={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://placehold.co/100x100?text=Tour'} alt={tour.name} className="brief-image" />
                                <div className="brief-details">
                                    <h3>{tour.name}</h3>
                                    <p className="hotel-city"><MapPin size={12} /> {tour.city || 'Karabakh'}, Azerbaijan</p>
                                </div>
                            </div>

                            <div className="booking-config">
                                <div className="config-item">
                                    <label><Calendar size={16} /> Expedition Date</label>
                                    <div className="guest-text">{selectedDateStr}</div>
                                </div>
                                <div className="config-item guest-summary">
                                    <label><Users size={16} /> Participants</label>
                                    <div className="guest-text participant-row">
                                        <span>Total Travelers</span>
                                        <div className="participant-controls">
                                            <button 
                                                type="button" 
                                                onClick={() => setParticipants(Math.max(1, participants - 1))}
                                                disabled={participants <= 1}
                                            >-</button>
                                            <span className="p-count">{participants}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => setParticipants(Math.min(tour.groupSizeMax, participants + 1))}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="price-breakdown">
                                <div className="breakdown-title">Pricing Summary</div>
                                <div className="breakdown-row">
                                    <span className="day-info">Base Ticket (x{participants})</span>
                                    <span className="day-val">₼{(pricePerPerson * participants).toFixed(2)}</span>
                                </div>

                                <div className="price-total">
                                    <span>Total Amount</span>
                                    <span>₼{netTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                className={`confirm ${bookingLoading || !isValidWallet ? 'disabled' : ''}`}
                                onClick={handleBooking}
                                disabled={bookingLoading || !isValidWallet}
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

                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
};