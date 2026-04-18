import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelWebApi } from '../../api/hotel.web.api';
import { useHotelRooms } from '../../hooks/useHotelRooms';
import type { IHotel, IRoomType } from '../../types';
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

    if (loading) return <div className="loading-state">Loading details...</div>;
    if (error) return <div className="error-state">{error}</div>;
    if (!hotel) return <div className="empty-state">Hotel not found</div>;

    // Helper to format image URLs
    const getImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/800x600?text=No+Image';
        if (url.startsWith('http') || url.startsWith('/images/')) return url;
        return `http://localhost:4004${url.startsWith('/') ? '' : '/'}${url}`;
    };

    // Helper for gallery images
    const images = hotel.images && hotel.images.length > 0 ? hotel.images : [{ id: '1', url: '/images/shusha-hotel.png', order: 0 }];
    const mainImg = getImageUrl(images[0].url);
    const sideImgs = [
        getImageUrl(images[1 % images.length].url),
        getImageUrl(images[2 % images.length].url),
        getImageUrl(images[3 % images.length].url),
        getImageUrl(images[4 % images.length].url),
    ];

    // Premium Amenity Icon Mapper
    const getAmenityConfig = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('wifi')) return 'fa-solid fa-wifi';
        if (lower.includes('water')) return 'fa-solid fa-bottle-water';
        if (lower.includes('charging') || lower.includes('usb')) return 'fa-brands fa-usb';
        if (lower.includes('climate') || lower.includes('ac')) return 'fa-solid fa-snowflake';
        if (lower.includes('massage') || lower.includes('spa')) return 'fa-solid fa-spa';
        if (lower.includes('concierge')) return 'fa-solid fa-bell-concierge';
        if (lower.includes('pool')) return 'fa-solid fa-person-swimming';
        if (lower.includes('parking')) return 'fa-solid fa-square-parking';
        if (lower.includes('gym')) return 'fa-solid fa-dumbbell';
        if (lower.includes('restaurant')) return 'fa-solid fa-utensils';
        return 'fa-solid fa-circle-check';
    };

    return (
        <div className="hotel-detail-page">
            <main className="container">
                
                {/* BREADCRUMB */}
                <div className="premium-breadcrumb">
                    <span>Hotels & Stays</span>
                    <i className="fa-solid fa-chevron-right"></i>
                    <span>{hotel.city || 'Shusha'}</span>
                    <i className="fa-solid fa-chevron-right"></i>
                    <span className="current">{hotel.name}</span>
                </div>

                {/* HEADER SECTION */}
                <header className="premium-hotel-header">
                    <div className="header-info">
                        <h1>{hotel.name}</h1>
                        <div className="meta-row">
                            <div className="stars">
                                {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
                                    <i key={i} className="fa-solid fa-star"></i>
                                ))}
                            </div>
                            <div className="rating-badge">
                                <strong>{hotel.rating ? hotel.rating.toFixed(1) : '5.0'}</strong>
                                <span>({hotel.reviewCount || '0'} Reviews)</span>
                            </div>
                            <span className="dot">•</span>
                            <div className="location">
                                <i className="fa-solid fa-location-dot"></i>
                                <a href={hotel.latitude && hotel.longitude ? `https://www.google.com/maps/search/?api=1&query=$${hotel.latitude},${hotel.longitude}` : `https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(`${hotel.name}, ${hotel.city}, ${hotel.address}`)}`} target="_blank" rel="noopener noreferrer">
                                    {hotel.address}{hotel.city ? `, ${hotel.city}` : ''}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn-premium"><i className="fa-regular fa-heart"></i></button>
                        <button className="icon-btn-premium"><i className="fa-solid fa-share-nodes"></i></button>
                    </div>
                </header>

                {/* GALLERY SECTION (1 Main + 4 Small Grid) */}
                <section className="premium-gallery">
                    <div className="gallery-main">
                        <img src={mainImg} alt="Main view" />
                        <div className="gallery-badge">Exterior</div>
                    </div>
                    <div className="gallery-grid-4">
                        <div className="gallery-item"><img src={sideImgs[0]} alt="Gallery 1" /></div>
                        <div className="gallery-item"><img src={sideImgs[1]} alt="Gallery 2" /></div>
                        <div className="gallery-item"><img src={sideImgs[2]} alt="Gallery 3" /></div>
                        <div className="gallery-item"><img src={sideImgs[3]} alt="Gallery 4" /></div>
                    </div>
                </section>

                {/* CONTENT SPLIT (Left: About/Amenities, Right: Map/Rating) */}
                <div className="premium-content-split">
                    
                    {/* LEFT COLUMN */}
                    <div className="split-main">
                        {/* ABOUT CARD */}
                        <div className="premium-card">
                            <h2>About the Hotel</h2>
                            <p className="about-text">{hotel.description || 'Experience luxury and traditional hospitality in the heart of Karabakh. Our hotel offers panoramic views and premium amenities.'}</p>
                        </div>

                        {/* AMENITIES CARD */}
                        {hotel.amenities && hotel.amenities.length > 0 && (
                            <div className="premium-card">
                                <h2>Amenities</h2>
                                <div className="amenities-grid">
                                    {hotel.amenities.map((am: any) => {
                                        const name = am.amenity?.name || am.name;
                                        return (
                                            <div key={am.id || Math.random()} className="amenity-list-item">
                                                <div className="icon-box"><i className={getAmenityConfig(name)}></i></div>
                                                <span>{name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="split-sidebar">
                        {/* MAP CARD */}
                        <div className="premium-card map-wrapper-card">
                            <div className="map-embed">
                                {hotel.latitude && hotel.longitude ? (
                                    /* Koordinatlarla xəritə */
                                    <iframe 
                                        title="Map" 
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 0 }} 
                                        loading="lazy" 
                                        src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
                                    ></iframe>
                                ) : (
                                    /* Əgər koordinat yoxdursa, ünvanla axtarış */
                                    <iframe 
                                        title="Map" 
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 0 }} 
                                        loading="lazy" 
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(`${hotel.name}, ${hotel.city}, ${hotel.address}`)}&z=15&output=embed`}
                                    ></iframe>
                                )}
                                
                                {/* "View on map" düyməsi üçün linki düzəldirik */}
                                <a 
                                    className="map-overlay-btn" 
                                    href={hotel.latitude && hotel.longitude 
                                        ? `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}` 
                                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.address}`)}`
                                    } 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-solid fa-location-crosshairs"></i> View on map
                                </a>
                            </div>
                            <div className="map-text-info">
                                <strong>Location</strong>
                                <span>{hotel.address}{hotel.city ? `, ${hotel.city}` : ''}</span>
                            </div>
                        </div>

                        {/* RATING CARD */}
                        <div className="premium-card rating-breakdown-card">
                            <div className="rating-score-head">
                                <div className="score-circle">{hotel.rating ? hotel.rating.toFixed(1) : '5.0'}</div>
                                <div className="score-text">
                                    <strong>{hotel.rating && hotel.rating >= 8 ? 'Excellent' : 'Outstanding'}</strong>
                                    <span>Based on {hotel.reviewCount || '320'} verified reviews</span>
                                </div>
                            </div>
                            <div className="rating-bars">
                                <div className="bar-row">
                                    <span>Cleanliness</span>
                                    <div className="bar-track"><div className="bar-fill" style={{ width: '98%' }}></div></div>
                                    <strong>4.9</strong>
                                </div>
                                <div className="bar-row">
                                    <span>Comfort</span>
                                    <div className="bar-track"><div className="bar-fill" style={{ width: '94%' }}></div></div>
                                    <strong>4.7</strong>
                                </div>
                                <div className="bar-row">
                                    <span>Location</span>
                                    <div className="bar-track"><div className="bar-fill" style={{ width: '100%' }}></div></div>
                                    <strong>5.0</strong>
                                </div>
                            </div>
                            <a href="#reviews" className="read-reviews-link">Read all reviews <i className="fa-solid fa-arrow-right"></i></a>
                        </div>
                    </div>

                </div>

                {/* HORIZONTAL CONTEXT SEARCH BAR */}
                <div className="contextual-search-bar">
                    <div className="cs-item">
                        <div className="cs-icon"><i className="fa-solid fa-location-dot"></i></div>
                        <div className="cs-info">
                            <label>DESTINATION</label>
                            <strong>{hotel.city || 'Shusha'}, Karabakh</strong>
                        </div>
                    </div>
                    <div className="cs-divider"></div>
                    <div className="cs-item">
                        <div className="cs-icon"><i className="fa-regular fa-calendar"></i></div>
                        <div className="cs-info">
                            <label>DATES</label>
                            <strong>Oct 24 – Oct 28</strong>
                        </div>
                    </div>
                    <div className="cs-divider"></div>
                    <div className="cs-item">
                        <div className="cs-icon"><i className="fa-solid fa-user-group"></i></div>
                        <div className="cs-info">
                            <label>GUESTS</label>
                            <strong>2 Adults, 0 Children</strong>
                        </div>
                    </div>
                    <div className="cs-message">
                        Showing available rooms
                    </div>
                </div>

                {/* ROOMS HEADER */}
                <div className="rooms-section-header" id="rooms">
                    <h2>Available Rooms</h2>
                    <div className="rooms-filters">
                        <button className="active">All Rooms</button>
                        <button>Suites</button>
                        <button>Family</button>
                    </div>
                </div>

                {/* ROOMS LIST */}
                <section className="premium-room-list">
                    {roomsLoading && <div className="loading-state">Loading rooms...</div>}
                    {!roomsLoading && rooms.length === 0 && (
                        <div className="empty-state">No rooms are currently available for this property.</div>
                    )}
                    {rooms.map(room => (
                        <article key={room.id} className={`room-premium-card ${selectedRoom?.id === room.id ? 'selected-ring' : ''}`}>
                            
                            {/* SOL TƏRƏF: Şəkil */}
                            <div className="room-image-col">
                                <img src={room.images && room.images.length > 0 ? getImageUrl(room.images[0].url) : 'https://placehold.co/400x300?text=Room'} alt={room.name} />
                                {room.totalInventory > 0 && <span className="best-seller-badge">BEST SELLER</span>}
                            </div>
                            
                            {/* SAĞ TƏRƏF: Məzmun */}
                            <div className="room-content-col">
                                
                                {/* Header: Başlıq və Details Düyməsi */}
                                <div className="room-header-row">
                                    <div className="room-title-area">
                                        <h3>{room.name}</h3>
                                        <span className="hotel-sub">{hotel.name}</span>
                                    </div>
                                    <button className="details-pill-btn">
                                        <i className="fa-solid fa-circle-info"></i> Details
                                    </button>
                                </div>
                                
                                {/* Specs: Pill (kapsul) formalı özəlliklər */}
                                <div className="room-specs-pills">
                                    {room.roomSizeM2 && (
                                        <span className="spec-pill">
                                            <i className="fa-solid fa-ruler-combined"></i> {room.roomSizeM2}m²
                                        </span>
                                    )}
                                    <span className="spec-pill">
                                        <i className="fa-solid fa-user-group"></i> Max {room.maxAdults} Guests
                                    </span>
                                    <span className="spec-pill">
                                        <i className="fa-solid fa-bed"></i> {room.bedType || '1 King Bed'}
                                    </span>
                                    <span className="spec-pill">
                                        <i className="fa-solid fa-mountain-sun"></i> Mountain View
                                    </span>
                                </div>
                                
                                {/* Açıqlama */}
                                <p className="room-desc-text">
                                    {room.description || 'Experience luxury with a panoramic view of the Karabakh mountains. Includes a minibar, working desk, and premium toiletries.'}
                                </p>
                                
                                {/* Footer: Qiymət və Seçim Düyməsi */}
                                <div className="room-footer-row">
                                    <div className="price-info-area">
                                        <span className="starting-label">Starting from</span>
                                        <div className="price-amount-wrap">
                                            <span className="currency">₼</span>
                                            <span className="amount">{room.basePrice || '---'}</span>
                                        </div>
                                        <span className="tax-label">includes taxes & fees</span>
                                    </div>
                                    
                                    <button 
                                        className={`select-room-btn ${selectedRoom?.id === room.id ? 'active' : ''}`}
                                        onClick={() => setSelectedRoom(room)}
                                    >
                                        {selectedRoom?.id === room.id ? 'Selected ✓' : 'Select Room'}
                                    </button>
                                </div>

                            </div>
                        </article>
                    ))}
                </section>

            </main>

            {/* STICKY SUMMARY FOOTER */}
            <footer className={`premium-sticky-footer ${selectedRoom ? 'show' : ''}`}>
                <div className="footer-content container">
                    <div className="summary-left">
                        <img src={selectedRoom?.images?.[0]?.url ? getImageUrl(selectedRoom.images[0].url) : 'https://placehold.co/100x100'} alt="Selected Room" />
                        <div className="summary-info">
                            <small>Your selection at {hotel.name}</small>
                            <strong>{selectedRoom?.name}</strong>
                        </div>
                    </div>

                    <div className="summary-right">
                        <div className="summary-price-box">
                            <small>Total Price</small>
                            <strong>₼{selectedRoom?.basePrice || '---'}</strong>
                        </div>
                        <button onClick={handleCheckout} className="checkout-btn">
                            Continue to Checkout <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};