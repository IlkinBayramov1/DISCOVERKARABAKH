import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Coffee, Car, Wind, Check } from 'lucide-react';
import './HotelDetails.css';

const MOCK_HOTEL = {
    id: '1',
    name: 'Shusha Grand Hotel',
    rating: 5,
    reviewCount: 124,
    location: 'Vagif Mausoleum Area, Shusha, Karabakh',
    description: 'Experience unparalleled luxury in the heart of Shusha. Overlooking the legendary mountains, our hotel combines historic Karabakh architecture with modern 5-star amenities. Enjoy our heated infinity pool, authentic local cuisine at our rooftop restaurant, and spacious suites.',
    images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522771731478-4abdda1ac986?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    amenities: [
        { name: 'Free High-Speed WiFi', icon: Wifi },
        { name: 'Breakfast Included', icon: Coffee },
        { name: 'Free Parking', icon: Car },
        { name: 'Air Conditioning', icon: Wind }
    ],
    rooms: [
        { id: '101', name: 'Deluxe Mountain View', capacity: '2 Adults, 1 Child', price: 150, bedType: '1 King Bed' },
        { id: '102', name: 'Executive Suite', capacity: '2 Adults, 2 Children', price: 280, bedType: '1 King, 1 Sofa Bed' }
    ]
};

export default function HotelDetails() {
    const { id } = useParams();
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

    // Mock page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    return (
        <div className="hotel-details-container max-w-7xl mx-auto px-4 py-8">
            {/* Header Section */}
            <header className="details-header mb-6">
                <div className="flex-between align-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{MOCK_HOTEL.name}</h1>
                        <div className="flex-align-center gap-4 text-sm">
                            <div className="rating-badge flex-align-center gap-1">
                                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                <span>{MOCK_HOTEL.rating}.0</span>
                            </div>
                            <span className="text-muted underline cursor-pointer">{MOCK_HOTEL.reviewCount} Reviews</span>
                            <span className="text-muted flex-align-center gap-1">
                                <MapPin size={16} /> {MOCK_HOTEL.location}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Masonry Image Gallery */}
            <section className="image-gallery mb-12">
                <div className="main-image">
                    <img src={MOCK_HOTEL.images[0]} alt="Main" />
                </div>
                <div className="side-images">
                    <img src={MOCK_HOTEL.images[1]} alt="Side 1" />
                    <img src={MOCK_HOTEL.images[2]} alt="Side 2" />
                    <img src={MOCK_HOTEL.images[3]} alt="Side 3" />
                </div>
            </section>

            {/* Content Split: Description & Booking Engine */}
            <div className="details-grid">

                {/* Left Column: Info */}
                <div className="details-main">

                    <section className="about-section glassmorphism p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">About this property</h2>
                        <p className="text-muted leading-relaxed">{MOCK_HOTEL.description}</p>
                    </section>

                    <section className="amenities-section glassmorphism p-6 mb-8">
                        <h2 className="text-xl font-bold mb-6">Popular Amenities</h2>
                        <div className="amenities-grid">
                            {MOCK_HOTEL.amenities.map((item, idx) => (
                                <div key={idx} className="amenity-item flex-align-center gap-3">
                                    <item.icon size={20} className="text-muted" />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rooms-section glassmorphism p-6">
                        <h2 className="text-xl font-bold mb-6">Available Rooms</h2>
                        <div className="rooms-list flex-col gap-4">
                            {MOCK_HOTEL.rooms.map(room => (
                                <div key={room.id} className={`room-card flex-between ${selectedRoom === room.id ? 'selected' : ''}`}>
                                    <div>
                                        <h3 className="font-bold mb-1">{room.name}</h3>
                                        <p className="text-sm text-muted mb-2">{room.bedType} • {room.capacity}</p>
                                        <ul className="text-sm text-success flex-align-center gap-2">
                                            <li><Check size={14} /> Non-refundable</li>
                                            <li><Check size={14} /> Pay in advance</li>
                                        </ul>
                                    </div>
                                    <div className="room-price-action text-right">
                                        <div className="text-xl font-bold mb-3">${room.price} <span className="text-sm font-normal text-muted">/ night</span></div>
                                        <button
                                            className={`btn-primary ${selectedRoom === room.id ? 'active' : 'outline'}`}
                                            onClick={() => setSelectedRoom(room.id)}
                                        >
                                            {selectedRoom === room.id ? 'Selected' : 'Reserve'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Right Column: Sticky Booking / Checkout Summary */}
                <aside className="details-sidebar">
                    <div className="booking-summary-card glassmorphism p-6 sticky-top">
                        <div className="price-header flex-between mb-4 border-b pb-4">
                            <div>
                                <span className="text-2xl font-bold">${selectedRoom ? MOCK_HOTEL.rooms.find(r => r.id === selectedRoom)?.price : '--'}</span>
                                <span className="text-muted"> / night</span>
                            </div>
                            <div className="rating flex-align-center gap-1 text-sm font-bold">
                                <Star size={14} fill="#f59e0b" color="#f59e0b" /> {MOCK_HOTEL.rating}.0
                            </div>
                        </div>

                        <div className="booking-form-dates flex-between border rounded-lg p-3 mb-4">
                            <div className="date-block text-left w-1/2 border-r">
                                <span className="block text-xs font-bold uppercase text-muted">Check-in</span>
                                <span>Add date</span>
                            </div>
                            <div className="date-block text-left w-1/2 pl-3">
                                <span className="block text-xs font-bold uppercase text-muted">Check-out</span>
                                <span>Add date</span>
                            </div>
                        </div>

                        <Link
                            to={selectedRoom ? `/checkout?hotel=${MOCK_HOTEL.id}&room=${selectedRoom}` : '#'}
                            className={`btn-primary w-full text-center py-3 text-lg ${!selectedRoom ? 'disabled' : ''}`}
                            style={{ opacity: selectedRoom ? 1 : 0.5, pointerEvents: selectedRoom ? 'auto' : 'none' }}
                        >
                            {selectedRoom ? 'Proceed to Checkout' : 'Select a Room'}
                        </Link>

                        <p className="text-center text-sm text-muted mt-4">You won't be charged yet</p>
                    </div>
                </aside>

            </div>
        </div>
    );
}
