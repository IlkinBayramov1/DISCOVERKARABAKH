import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelWebApi } from '../api/hotel.web.api';
import { useHotelRooms } from '../hooks/useHotelRooms';
import type { IHotel, IRoomType } from '../types';
import './HotelDetailPage.css';

export const HotelDetailPage: React.FC = () => {
    const { id: routeId } = useParams<{ id: string }>();
    const hotelId = routeId || '';
    const navigate = useNavigate();

    const [hotel, setHotel] = useState<IHotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { rooms, loading: roomsLoading } = useHotelRooms(hotelId);
    const [selectedRoom, setSelectedRoom] = useState<IRoomType | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const response = await hotelWebApi.getHotelById(hotelId);
                // Unwrap the data from the standardized backend response { success: true, data: { ... } }
                const hotelData = response?.data || response; 
                if (isMounted) setHotel(hotelData);
            } catch (err: any) {
                if (isMounted) setError(err.message || 'Failed to load hotel details');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        if (hotelId) fetchDetail();
        return () => { isMounted = false; };
    }, [hotelId]);

    const handleCheckout = () => {
        if (selectedRoom) {
            navigate(`/checkout?hotelId=${hotelId}&roomId=${selectedRoom.id}`);
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-500">Loading details...</div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
    if (!hotel) return <div className="text-center py-12 text-gray-500">Hotel not found</div>;

    // Helper to format image URLs
    const getImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/400x300?text=No+Image';
        if (url.startsWith('http') || url.startsWith('/images/')) return url;
        return `http://localhost:4004${url.startsWith('/') ? '' : '/'}${url}`;
    };

    // Helper for gallery images: if fewer than 5 images, cycle through available ones so there are no placeholders
    const images = hotel.images && hotel.images.length > 0 ? hotel.images : [{ id: '1', url: '/images/shusha-hotel.png', order: 0 }];
    const mainImg = getImageUrl(images[0].url);
    const sideImgs = [
        getImageUrl(images[1 % images.length].url),
        getImageUrl(images[2 % images.length].url),
        getImageUrl(images[3 % images.length].url),
        getImageUrl(images[4 % images.length].url),
    ];

    return (
        <>
            <main className="hotel-container">
                {/* BREADCRUMB SECTION */}
                <section className="breadcrumb">
                    Hotels & Stays › {hotel.city || 'Shusha'} › <strong>{hotel.name}</strong>
                </section>

                {/* HEADER SECTION */}
                <header className="hotel-header">
                    <div>
                        <h1>{hotel.name}</h1>
                        <div className="hotel-meta">
                            <span className="stars">
                                {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
                                    <i key={i} className="fa-solid fa-star"></i>
                                ))}
                            </span>
                            <strong className="rating">{hotel.rating ? hotel.rating.toFixed(1) : '5.0'}</strong>
                            <span className="reviews">({hotel.reviewCount || '0'} Reviews)</span>
                            <span className="dot"></span>
                            <i className="fa-solid fa-location-dot"></i>
                            <a
                                href={hotel.latitude && hotel.longitude ? `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.city}, ${hotel.address}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                {hotel.city ? `${hotel.city}, ` : ''}{hotel.address}
                            </a>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button><i className="fa-regular fa-heart"></i></button>
                        <button><i className="fa-solid fa-share-nodes"></i></button>
                    </div>
                </header>

                {/* IMAGES SECTION */}
                <section className="gallery-grid">
                    <div className="main-img">
                        <img src={mainImg} alt="Main view" />
                        <span className="img-badge">Exterior / Main</span>
                    </div>
                    <div><img src={sideImgs[0]} alt="Gallery 1" /></div>
                    <div><img src={sideImgs[1]} alt="Gallery 2" /></div>
                    <div><img src={sideImgs[2]} alt="Gallery 3" /></div>
                    <div><img src={sideImgs[3]} alt="Gallery 4" /></div>
                </section>

                {/* DETAILS SECTION */}
                <section className="detail-grid">

                    <div className="flex flex-col gap-6 w-full">
                        {/* ABOUT CARD */}
                        <div className="about-card">
                            <h3>About the Hotel</h3>
                            <p>{hotel.description || 'No description provided.'}</p>
                        </div>

                        {/* MAP CARD */}
                        <div className="map-card">
                            <div className="map-preview relative h-[250px] w-full rounded-2xl overflow-hidden mb-4 border border-gray-100">
                                {hotel.latitude && hotel.longitude ? (
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 0 }} 
                                        loading="lazy" 
                                        allowFullScreen 
                                        src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}>
                                    </iframe>
                                ) : (
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 0 }} 
                                        loading="lazy" 
                                        allowFullScreen 
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(`${hotel.name}, ${hotel.city}, ${hotel.address}`)}&z=15&output=embed`}>
                                    </iframe>
                                )}
                                <a
                                    className="map-badge absolute bottom-3 right-3"
                                    style={{ textDecoration: 'none' }}
                                    href={hotel.latitude && hotel.longitude ? `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.city}, ${hotel.address}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-solid fa-location-crosshairs"></i> Open maps app
                                </a>
                            </div>
                            <div className="map-content">
                                <h4>Location</h4>
                                <a
                                    className="map-address hover:underline"
                                    href={hotel.latitude && hotel.longitude ? `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.city}, ${hotel.address}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-solid fa-location-dot"></i>
                                    {hotel.city ? `${hotel.city}, ` : ''}{hotel.address}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RATING CARD & SEARCH/MAP CONTEXT (Right Column) */}
                    <div className="flex flex-col gap-6 w-full">
                        <div className="rating-card">
                            <div className="rating-header">
                                <div className="rating-circle">{hotel.rating ? hotel.rating.toFixed(1) : '–'}</div>
                                <div className="rating-summary">
                                    <strong>{hotel.rating && hotel.rating >= 8 ? 'Excellent' : 'Good'}</strong>
                                    <span>Based on {hotel.reviewCount || 0} verified reviews</span>
                                </div>
                            </div>

                            <div className="rating-bars">
                                <div className="rating-row">
                                    <span>Cleanliness</span>
                                    <div className="bar"><div className="fill" style={{ width: '95%' }}></div></div>
                                    <strong>{hotel.rating ? (hotel.rating * 0.98).toFixed(1) : '–'}</strong>
                                </div>
                                <div className="rating-row">
                                    <span>Comfort</span>
                                    <div className="bar"><div className="fill" style={{ width: '92%' }}></div></div>
                                    <strong>{hotel.rating ? (hotel.rating * 0.95).toFixed(1) : '–'}</strong>
                                </div>
                                <div className="rating-row">
                                    <span>Location</span>
                                    <div className="bar"><div className="fill" style={{ width: '98%' }}></div></div>
                                    <strong>{hotel.rating ? (hotel.rating * 0.99).toFixed(1) : '–'}</strong>
                                </div>
                            </div>
                            <a href="#reviews" className="rating-link">Read all reviews <i className="fa-solid fa-arrow-right-long"></i></a>
                        </div>

                        {/* AMENITIES SECTION (Moved below Rating Card as requested implicitly by Layout flow, or just keep in left ?) 
                            Wait, user said: "aboutun saginda Cleanliness - Comfort - Location bunun ustunde" -> Rating card above the Map.
                        */}
                        {hotel.amenities && hotel.amenities.length > 0 && (
                            <div className="amenities-card">
                                <h3>Amenities</h3>
                                <div className="amenities">
                                    {hotel.amenities.map((am: any) => {
                                        const name = am.amenity?.name || am.name;
                                        // Simple icon mapping for better visuals
                                        const iconMap: { [key: string]: string } = {
                                            'Free WiFi': 'fa-wifi',
                                            'Swimming Pool': 'fa-person-swimming',
                                            'Free Parking': 'fa-square-p',
                                            'Spa & Wellness': 'fa-spa',
                                            'Restaurant': 'fa-utensils',
                                            'Gym': 'fa-dumbbell',
                                            'Bar': 'fa-martini-glass-citrus',
                                            'Conference Room': 'fa-users-rectangle',
                                            'Room Service': 'fa-bell-concierge',
                                            'Airport Shuttle': 'fa-van-shuttle'
                                        };
                                        const iconClass = iconMap[name] || 'fa-check';
                                        
                                        return (
                                            <span key={am.id}>
                                                <i className={`fa-solid ${iconClass}`}></i> {name}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* SEARCH SECTION (Contextual sidebar-like) */}
                        <section className="search-context !m-0">
                            <div className="ctx-item w-full">
                                <i className="fa-solid fa-location-dot"></i>
                                <div>
                                    <small>Destination</small>
                                    <strong>{hotel.city}, Karabakh</strong>
                                </div>
                            </div>
                            <div className="ctx-item w-full">
                                <i className="fa-regular fa-calendar"></i>
                                <div>
                                    <small>Dates</small>
                                    <strong>Any Dates</strong>
                                </div>
                            </div>
                            <div className="ctx-item w-full">
                                <i className="fa-solid fa-user-group"></i>
                                <div>
                                    <small>Guests</small>
                                    <strong>Standard Occupancy</strong>
                                </div>
                            </div>
                            <span className="ctx-note w-full mt-2 text-center block">
                                Showing all available rooms
                            </span>
                        </section>
                    </div>
                </section>

                {/* ROOMS HEADER SECTION */}
                <div className="rooms-header" id="rooms">
                    <h2>Available Rooms</h2>
                    <div className="room-tabs">
                        <button className="active">All Rooms</button>
                    </div>
                </div>

                {/* ROOMS LIST SECTION */}
                <section className="room-list">
                    {roomsLoading && <div className="p-8 text-center bg-white rounded-2xl shadow-sm">Loading rooms...</div>}
                    {!roomsLoading && rooms.length === 0 && (
                        <div className="p-8 text-center bg-white rounded-2xl shadow-sm text-gray-500">
                            No rooms are currently available for this property.
                        </div>
                    )}
                    {rooms.map(room => (
                        <article key={room.id} className="room-booking-card">
                            <div className="room-photo">
                                <img src={room.images && room.images.length > 0 ? getImageUrl(room.images[0].url) : 'https://placehold.co/400x300?text=Room'} alt={room.name} />
                                {room.totalInventory > 0 && <span className="room-tag hover:text-blue-600 cursor-pointer">BEST SELLER</span>}
                            </div>
                            <div className="room-details">
                                <div className="room-head">
                                    <div>
                                        <h4>{room.name}</h4>
                                        <p className="room-subtitle">{hotel.name}</p>
                                    </div>
                                    <button className="room-header-link" style={{ border: 'none', cursor: 'pointer' }}>
                                        <i className="fa-solid fa-circle-info"></i> Details
                                    </button>
                                </div>

                                <div className="room-features">
                                    {room.roomSizeM2 && <span><i className="fa-solid fa-ruler-combined"></i> {room.roomSizeM2}m²</span>}
                                    <span><i className="fa-solid fa-user-group"></i> Max {room.maxAdults} Guests</span>
                                    <span><i className="fa-solid fa-bed"></i> {room.bedType || 'Various'}</span>
                                    <span><i className="fa-solid fa-mountain-sun"></i> Mountain View</span>
                                </div>

                                <p className="room-desc">
                                    {room.description || 'Experience luxury and comfort in this well-appointed room.'}
                                </p>

                                <div className="room-booking-footer">
                                    <div className="room-price">
                                        <small>Starting from</small>
                                        <strong>₼{room.basePrice || '---'}</strong>
                                        <span>includes taxes & fees</span>
                                    </div>
                                    <div className="room-actions">
                                        <button
                                            className={`room-select-btn ${selectedRoom?.id === room.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedRoom(room)}
                                        >
                                            {selectedRoom?.id === room.id ? (
                                                <>Selected <i className="fa-solid fa-check"></i></>
                                            ) : (
                                                'Select Room'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </main>

            {/* SUMMARY SECTION */}
            <footer className={`sticky-summary ${selectedRoom ? 'show' : ''}`}>
                <div className="summary-room">
                    <img src={selectedRoom?.images?.[0]?.url ? getImageUrl(selectedRoom.images[0].url) : 'https://placehold.co/100x100'} alt="Selected Room" />
                    <div>
                        <small>Your selection at {hotel.name}</small>
                        <strong>{selectedRoom?.name}</strong>
                    </div>
                </div>

                <div className="summary-price">
                    <small>Standard Price</small>
                    <strong>₼{selectedRoom?.basePrice || '---'}</strong>
                </div>

                <button onClick={handleCheckout} className="summary-btn">
                    Continue to Checkout
                    <i className="fa-solid fa-arrow-right-long"></i>
                </button>
            </footer>
        </>
    );
};
