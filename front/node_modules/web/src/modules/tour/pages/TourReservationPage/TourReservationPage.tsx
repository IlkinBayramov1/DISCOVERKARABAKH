import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Info, Users, CreditCard, ChevronLeft } from 'lucide-react';
import { useBooking } from '../../../booking/hooks/useBooking';
import { tourWebApi } from '../../api/tour.api';
import { useTourAvailability } from '../../hooks/useTourAvailability';
import type { ITour } from '../../types';
import { useProfile } from '../../../account/hooks/useProfile';
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
            navigate(`/booking-confirmation/${data.data.id}`);
        }
    };

    if (loadingTour || (dateParam && availabilityLoading && !availability)) {
        return <div className="min-h-screen py-20 text-center text-gray-500">Loading booking details...</div>;
    }

    if (!tourId || !tour) {
        return (
            <div className="min-h-screen py-20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Invalid Booking Request</h2>
                    <p className="text-gray-500 mb-6">We couldn't find the tour you selected.</p>
                    <button onClick={() => navigate('/tours')} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Back to Tours</button>
                </div>
            </div>
        );
    }

    const pricePerPerson = availability?.price ?? tour.pricePerPerson;
    const netTotal = pricePerPerson * participants;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-8">
                    <ChevronLeft size={20} /> Back to Tour Details
                </button>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Form Details */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-gray-900 mb-8">Secure Your Adventure</h1>

                        {bookingError && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 shadow-sm border border-red-100 font-medium">
                                {bookingError}
                            </div>
                        )}

                        {/* Contact Info */}
                        <section className="bg-white rounded-3xl p-8 mb-6 shadow-xl border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Users size={22} className="text-blue-600" /> Lead Traveler Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 outline-none transition-all" 
                                        placeholder="e.g. John" 
                                        value={firstName} onChange={e => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 outline-none transition-all" 
                                        placeholder="e.g. Doe"
                                        value={lastName} onChange={e => setLastName(e.target.value)} 
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 outline-none transition-all" 
                                        placeholder="Confirmation goes here" 
                                        value={email} onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                    <input 
                                        type="text" 
                                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 outline-none transition-all" 
                                        placeholder="e.g. +994 50 123 45 67" 
                                        value={phone} onChange={e => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Payment Info */}
                        <section className="bg-white rounded-3xl p-8 mb-6 shadow-xl border border-gray-100">
                            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <CreditCard size={22} className="text-blue-600" /> Payment Method
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">Secure and encrypted payment processing.</p>
                            
                            <div className="space-y-4">
                                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        checked={paymentMethod === 'card'} 
                                        onChange={() => setPaymentMethod('card')}
                                        className="w-5 h-5 text-blue-600" 
                                    />
                                    <div className="flex-1">
                                        <span className="block font-bold text-gray-900">Credit / Debit Card</span>
                                        <span className="text-sm text-gray-500">Pay securely now</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-blue-900">VISA</span>
                                        <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-red-600">MC</span>
                                    </div>
                                </label>
                                
                                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        checked={paymentMethod === 'cash'} 
                                        onChange={() => setPaymentMethod('cash')}
                                        className="w-5 h-5 text-blue-600" 
                                    />
                                    <div className="flex-1">
                                        <span className="block font-bold text-gray-900">Pay on Arrival</span>
                                        <span className="text-sm text-gray-500">Reserve now, pay when the tour begins</span>
                                    </div>
                                </label>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Pricing Engine Widget */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white rounded-3xl p-8 sticky top-24 shadow-2xl border border-gray-100">
                            
                            <div className="mb-6 flex gap-4 border-b border-gray-100 pb-6">
                                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img src={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://placehold.co/100x100?text=Tour'} alt={tour.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{tour.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{tour.city || 'Karabakh'}</p>
                                </div>
                            </div>
                            
                            <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold text-gray-600">Tour Date</span>
                                    <span className="font-bold text-gray-900">
                                        {dateParam ? new Date(dateParam).toLocaleDateString() : (tour.startDate ? new Date(tour.startDate).toLocaleDateString() : 'N/A')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-600">Participants</span>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 font-bold hover:border-gray-400 disabled:opacity-50"
                                            onClick={() => setParticipants(Math.max(1, participants - 1))}
                                            disabled={participants <= 1}
                                        >-</button>
                                        <span className="font-bold text-gray-900 w-4 text-center">{participants}</span>
                                        <button 
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 font-bold hover:border-gray-400 disabled:opacity-50"
                                            onClick={() => setParticipants(Math.min(tour.groupSizeMax, participants + 1))}
                                        >+</button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8 space-y-4 text-sm font-medium">
                                <div className="flex justify-between text-gray-600">
                                    <span>Base Ticket (x{participants})</span>
                                    <span>₼{(pricePerPerson * participants).toFixed(2)}</span>
                                </div>
                                
                                <div className="flex justify-between pt-4 border-t border-gray-100 text-xl font-black text-gray-900">
                                    <span>Total Price</span>
                                    <span>₼{netTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                className={`w-full py-4 rounded-2xl font-black text-lg text-white transition-all shadow-xl flex items-center justify-center gap-2 ${bookingLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:scale-[1.02]'}`}
                                onClick={handleBooking}
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <ShieldCheck size={20} />
                                        Complete Booking
                                    </>
                                )}
                            </button>
                            
                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium text-center">
                                <Info size={14} />
                                You won't be charged yet if you select "Pay on Arrival"
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
