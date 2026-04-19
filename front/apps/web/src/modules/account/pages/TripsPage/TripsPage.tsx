import React, { useEffect, useState } from 'react';
import { bookingApi } from '../../../../modules/booking/api/booking.api';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, ChevronRight, XCircle, Loader2, Plane } from 'lucide-react';

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

    const handleCancel = async (id: string) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        
        setCancelling(id);
        try {
            await bookingApi.cancelBooking(id);
            await fetchBookings(); // Refresh list
        } catch (err) {
            alert('Failed to cancel booking. Please contact support.');
        } finally {
            setCancelling(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-medium">Loading your trips...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
                        <p className="text-gray-500">View and manage your upcoming and past adventures.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/tours')} 
                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2"
                    >
                        <Plane size={20} />
                        Book New Adventure
                    </button>
                </header>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No trips found</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't booked any adventures yet. Explore our tours and hotels to get started!</p>
                        <button onClick={() => navigate('/tours')} className="text-blue-600 font-bold hover:underline">Explore Tours</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => {
                            const isTour = booking.bookingType === 'tour';
                            const details = isTour ? (booking.Tour || booking.tour) : booking.hotel;
                            const statusColor = booking.status === 'confirmed' ? 'text-green-600 bg-green-50' : 
                                              booking.status === 'cancelled' ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50';

                            return (
                                <div key={booking.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image/Icon placeholder */}
                                        <div className="w-full md:w-48 bg-gray-100 flex items-center justify-center relative">
                                            {isTour ? (
                                                <div className="bg-blue-600 text-white p-4 rounded-2xl absolute top-4 left-4 shadow-lg">
                                                    <Tag size={20} />
                                                </div>
                                            ) : (
                                                <div className="bg-green-600 text-white p-4 rounded-2xl absolute top-4 left-4 shadow-lg">
                                                    <MapPin size={20} />
                                                </div>
                                            )}
                                            <div className="text-gray-300">
                                                {isTour ? 'Tour Image' : 'Hotel Image'}
                                            </div>
                                        </div>

                                        <div className="flex-1 p-6 md:p-8">
                                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                                                        {details?.name || 'Untitled Adventure'}
                                                    </h3>
                                                    <p className="text-gray-500 flex items-center gap-1 text-sm mt-1">
                                                        <MapPin size={14} /> {details?.address || details?.city || 'Karabakh'}
                                                    </p>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${statusColor}`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-gray-50">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Booking ID</p>
                                                    <p className="font-mono text-sm font-bold text-gray-700">{booking.bookingNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Date</p>
                                                    <p className="font-bold text-gray-900">
                                                        {booking.items?.[0] ? new Date(booking.items[0].checkIn).toLocaleDateString() : 'TBA'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Price</p>
                                                    <p className="font-bold text-gray-900">{booking.totalPrice} {booking.currency}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Payment</p>
                                                    <p className="font-bold text-gray-900 capitalize">{booking.paymentStatus}</p>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-between">
                                                <button 
                                                    onClick={() => navigate(`/booking-confirmation/${booking.id}`)}
                                                    className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all"
                                                >
                                                    View Details <ChevronRight size={18} />
                                                </button>
                                                
                                                {booking.status !== 'cancelled' && (
                                                    <button 
                                                        onClick={() => handleCancel(booking.id)}
                                                        disabled={cancelling === booking.id}
                                                        className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2 text-sm disabled:opacity-50"
                                                    >
                                                        {cancelling === booking.id ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <XCircle size={16} />
                                                        )}
                                                        Cancel Reservation
                                                    </button>
                                                )}
                                            </div>
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
