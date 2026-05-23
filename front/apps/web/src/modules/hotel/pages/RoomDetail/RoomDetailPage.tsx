import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { hotelWebApi } from '../../api/hotel.web.api';
import { useBookingPreview } from '../../../booking/hooks/useBookingPreview';
import './RoomDetailPage.css';

export const RoomDetailPage: React.FC = () => {
    const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
    const navigate = useNavigate();

    const [room, setRoom] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImgIdx, setActiveImgIdx] = useState(0);
    const [searchParams] = useSearchParams();
    const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
    const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
    const [adults, setAdults] = useState(Number(searchParams.get('adults')) || 2);
    const [children, setChildren] = useState(Number(searchParams.get('children')) || 0);
    
    const { fetchPreview, previewData, loading: previewLoading, error: previewError } = useBookingPreview();

    useEffect(() => {
        if (checkIn && checkOut && hotelId && roomId) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            if (end > start) {
                fetchPreview({
                    type: 'hotel',
                    entityId: hotelId,
                    items: [{
                        roomTypeId: roomId,
                        checkIn,
                        checkOut,
                        adults,
                        children
                    }]
                });
            }
        }
    }, [checkIn, checkOut, hotelId, roomId, fetchPreview, adults, children]);

    useEffect(() => {
        const fetchRoom = async () => {
            if (!hotelId || !roomId) return;
            setLoading(true);
            try {
                const res = await hotelWebApi.getRoomById(hotelId, roomId, { checkIn, checkOut });
                setRoom(res.data || res);
            } catch (err: any) {
                setError(err.message || 'Failed to load room details');
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [hotelId, roomId, checkIn, checkOut]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (checkIn) params.set('checkIn', checkIn);
        if (checkOut) params.set('checkOut', checkOut);
        params.set('adults', adults.toString());
        params.set('children', children.toString());

        const newRelativePathQuery = window.location.pathname + '?' + params.toString();
        window.history.replaceState(null, '', newRelativePathQuery);
    }, [checkIn, checkOut, adults, children]);

    if (loading) {
        return (
            <div className="room-detail-loading">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <p>Loading premium suite details...</p>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="room-detail-error">
                <h2>Oooops!</h2>
                <p>{error || 'Room not found'}</p>
                <button className="back-btn-premium" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i> Go Back
                </button>
            </div>
        );
    }

    const hotel = room.hotel || {};
    const images = room.images?.length > 0 ? room.images : [{ url: 'https://placehold.co/1200x600?text=Premium+Room' }];

    const getImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/800x600?text=No+Image';
        if (url.startsWith('http') || url.startsWith('/images/')) return url;
        const baseUrl = import.meta.env.VITE_API_URL ? new URL(import.meta.env.VITE_API_URL).origin : '';
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const handleReserve = () => {
        if(!checkIn || !checkOut) {
            alert("Please select check-in and check-out dates.");
            return;
        }
        navigate(`/checkout?hotelId=${hotelId}&roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`);
    };

    const getAmenityIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('wifi')) return 'fa-solid fa-wifi';
        if (lower.includes('conditioning') || lower.includes('ac')) return 'fa-solid fa-snowflake';
        if (lower.includes('tv') || lower.includes('smart')) return 'fa-solid fa-tv';
        if (lower.includes('bar') || lower.includes('mini')) return 'fa-solid fa-wine-glass';
        if (lower.includes('coffee') || lower.includes('machine')) return 'fa-solid fa-mug-hot';
        if (lower.includes('safe')) return 'fa-solid fa-vault';
        if (lower.includes('bath') || lower.includes('shower')) return 'fa-solid fa-bath';
        if (lower.includes('desk') || lower.includes('work')) return 'fa-solid fa-desktop';
        if (lower.includes('bed')) return 'fa-solid fa-bed';
        if (lower.includes('view')) return 'fa-solid fa-mountain-sun';
        if (lower.includes('balcony')) return 'fa-solid fa-door-open';
        return 'fa-solid fa-circle-check';
    };

    const nights = (checkIn && checkOut) ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)) : 0;

    return (
        <div className="room-detail-wrapper">
            
            {/* PREMIUM HERO SECTION */}
            <section className="room-hero-premium">
                <div className="hero-gallery-container">
                    
                    {/* Top Overlay for Back Button */}
                    <div className="hero-top-overlay">
                        <div className="container">
                            <button className="back-link-btn-premium" onClick={() => navigate(-1)}>
                                <i className="fa-solid fa-arrow-left"></i> Back to {hotel.name || 'Hotel'}
                            </button>
                        </div>
                    </div>

                    {/* Main Image with Animation Key */}
                    <img
                        key={activeImgIdx} /* Şəkil dəyişdikcə animasiyanı tətikləmək üçün vacibdir */
                        src={getImageUrl(images[activeImgIdx].url)}
                        alt={`${room.name} view ${activeImgIdx + 1}`}
                        className="hero-main-img"
                    />

                    {/* Navigation Arrows (Şəkil sayı 1-dən çoxdursa görünür) */}
                    {images.length > 1 && (
                        <>
                            <button 
                                className="hero-nav-arrow prev" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveImgIdx(prev => prev === 0 ? images.length - 1 : prev - 1);
                                }}
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <button 
                                className="hero-nav-arrow next" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveImgIdx(prev => (prev + 1) % images.length);
                                }}
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </>
                    )}

                    {/* Bottom Overlay for Counter */}
                    <div className="hero-bottom-overlay">
                        <div className="container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div className="hero-counter-pill">
                                <i className="fa-regular fa-images"></i> {activeImgIdx + 1} / {images.length}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <main className="room-main-content container">
                <div className="room-grid-layout">

                    {/* LEFT CONTENT AREA */}
                    <div className="room-info-column">
                        <div className="premium-card room-header-card">
                            <div className="hotel-context">
                                <Link to={`/hotels/${hotelId}`} className="hotel-link">
                                    {hotel.name}
                                </Link>
                                <i className="fa-solid fa-chevron-right"></i>
                                <span>{hotel.city}</span>
                            </div>

                            <h1 className="room-title">{room.name}</h1>

                        </div>

                        {/* KEY SPECS STRIP */}
                        <div className="room-specs-premium-bar">
                            <div className="spec-item-premium">
                                <i className="fa-solid fa-ruler-combined"></i>
                                <div className="spec-texts">
                                    <label>Room Size</label>
                                    <strong>{room.roomSizeM2 || '45'} m²</strong>
                                </div>
                            </div>
                            <div className="spec-item-premium">
                                <i className="fa-solid fa-user-group"></i>
                                <div className="spec-texts">
                                    <label>Occupancy</label>
                                    <strong>Max {room.maxAdults} Adults</strong>
                                </div>
                            </div>
                            <div className="spec-item-premium">
                                <i className="fa-solid fa-child-reaching"></i>
                                <div className="spec-texts">
                                    <label>Children</label>
                                    <strong>Max {room.maxChildren || 0}</strong>
                                </div>
                            </div>
                            <div className="spec-item-premium">
                                <i className="fa-solid fa-bed"></i>
                                <div className="spec-texts">
                                    <label>Bed Configuration</label>
                                    <strong>{room.bedType || 'King Bed'}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="premium-card room-description-card">
                            <h3>Description</h3>
                            <p>{room.description || 'Experience a blend of luxury and comfort in this meticulously designed suite, featuring traditional motives interwoven with modern amenities.'}</p>
                        </div>

                        <div className="premium-card room-amenities-card">
                            <h3>Room Amenities</h3>
                            <div className="amenities-grid-premium">
                                {room.roomAmenities && room.roomAmenities.length > 0 ? (
                                    room.roomAmenities.map((am: any) => (
                                        <div key={am.id} className="am-item-premium">
                                            <div className="icon-wrapper"><i className={getAmenityIcon(am.amenityName)}></i></div>
                                            <span>{am.amenityName}</span>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="am-item-premium"><div className="icon-wrapper"><i className="fa-solid fa-wifi"></i></div><span>Free High-speed WiFi</span></div>
                                        <div className="am-item-premium"><div className="icon-wrapper"><i className="fa-solid fa-snowflake"></i></div><span>Air Conditioning</span></div>
                                        <div className="am-item-premium"><div className="icon-wrapper"><i className="fa-solid fa-tv"></i></div><span>Smart TV</span></div>
                                        <div className="am-item-premium"><div className="icon-wrapper"><i className="fa-solid fa-vault"></i></div><span>Private Safe</span></div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Location Map Section */}
                        <div className="room-location-card-wrapper">
                            <h3 className="section-title-premium"><i className="fa-solid fa-location-dot"></i> Hotel Location</h3>
                            <a 
                                className="premium-card clickable-map-card-horizontal" 
                                href={hotel.googleMapsUrl ? hotel.googleMapsUrl : (hotel.latitude && hotel.longitude ? `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.city}`)}`)}
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <div className="map-embed-container">
                                    {hotel.latitude && hotel.longitude ? (
                                        <iframe title="Map" width="100%" height="100%" style={{ border: 0, pointerEvents: 'none' }} loading="lazy" src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}></iframe>
                                    ) : (
                                        <iframe title="Map" width="100%" height="100%" style={{ border: 0, pointerEvents: 'none' }} loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(`${hotel.name}, ${hotel.city}`)}&z=15&output=embed`}></iframe>
                                    )}
                                    <div className="map-premium-overlay">
                                        <div className="map-pin-animation"></div>
                                        <span className="map-action-text">Open in Google Maps</span>
                                    </div>
                                </div>
                                <div className="map-info-pane">
                                    <div className="location-meta">
                                        <i className="fa-solid fa-map-pin"></i>
                                        <span>{hotel.city}, Azerbaijan</span>
                                    </div>
                                    <h4>{hotel.name}</h4>
                                    <p>{hotel.address || 'Shusha, Karabakh region'}</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR (STICKY BOOKING CARD) */}
                    <aside className="room-booking-sidebar">
                        <div className="booking-sticky-card-premium">
                            <div className="card-pricing-header">
                                <span className="tax-fees-notice">Excl. taxes & fees</span>
                                
                                {previewLoading ? (
                                    <div className="preview-calculating">
                                        <i className="fa-solid fa-spinner fa-spin"></i> Calculating best rates...
                                    </div>
                                ) : previewError ? (
                                    <div className="preview-error">
                                        <i className="fa-solid fa-exclamation-circle"></i> {previewError}
                                    </div>
                                ) : previewData ? (
                                    <div className="dynamic-price-display">
                                        <div className="price-main">₼{previewData.exactTotal}</div>
                                        <div className="price-sub">total for {nights} nights</div>
                                    </div>
                                ) : (
                                    <div className="base-price-display">
                                        <div className="price-main">₼{room.basePrice || '---'}</div>
                                        <div className="price-sub">avg. per night</div>
                                    </div>
                                )}
                            </div>

                            <div className="booking-selectors-container">
                                <div className="premium-input-group dates-picker">
                                    <div className="date-input-wrapper">
                                        <label><i className="fa-regular fa-calendar-check"></i> Check-in</label>
                                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                                    </div>
                                    <div className="input-divider"></div>
                                    <div className="date-input-wrapper">
                                        <label><i className="fa-regular fa-calendar-times"></i> Check-out</label>
                                        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                                    </div>
                                </div>

                                <div className="premium-input-group guests-picker">
                                    <div className="guest-control-block">
                                        <div className="label-with-icon">
                                            <i className="fa-solid fa-user"></i>
                                            <span>Adults</span>
                                        </div>
                                        <div className="stepper-controls-premium">
                                            <button onClick={() => setAdults(Math.max(1, adults - 1))} disabled={adults <= 1}>-</button>
                                            <span className="current-value">{adults}</span>
                                            <button onClick={() => setAdults(Math.min(room.maxAdults || 10, adults + 1))} disabled={adults >= (room.maxAdults || 10)}>+</button>
                                        </div>
                                    </div>
                                    <div className="guest-control-block">
                                        <div className="label-with-icon">
                                            <i className="fa-solid fa-child"></i>
                                            <span>Children</span>
                                        </div>
                                        <div className="stepper-controls-premium">
                                            <button onClick={() => setChildren(Math.max(0, children - 1))} disabled={children <= 0}>-</button>
                                            <span className="current-value">{children}</span>
                                            <button onClick={() => setChildren(Math.min(room.maxChildren || 5, children + 1))} disabled={children >= (room.maxChildren || 5)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {(!previewData && !previewLoading && checkIn && checkOut) && (
                                <div className="date-hint-premium">
                                    <i className="fa-solid fa-arrow-down"></i> Click Reserve to calculate final price
                                </div>
                            )}

                            <button className="reserve-btn-premium-final" onClick={handleReserve}>
                                Confirm Reservation <i className="fa-solid fa-arrow-right"></i>
                            </button>
                            
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
};