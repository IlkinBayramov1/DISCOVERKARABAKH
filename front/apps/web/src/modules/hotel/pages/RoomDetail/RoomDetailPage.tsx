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
    // Dynamic Pricing for breakdown
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

    // Update URL when dates change
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
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '48px', color: '#6a28c7' }}></i>
                <p>Loading premium suite details...</p>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="room-detail-error">
                <h2>Oooops!</h2>
                <p>{error || 'Room not found'}</p>
                <button className="back-btn" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    const hotel = room.hotel || {};
    const images = room.images?.length > 0 ? room.images : [{ url: 'https://placehold.co/1200x600?text=Premium+Room' }];

    const getImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/800x600?text=No+Image';
        if (url.startsWith('http') || url.startsWith('/images/')) return url;
        return `http://localhost:4004${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const handleReserve = () => {
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

    return (
        <div className="room-detail-wrapper">
            {/* HERO SECTION */}
            <section className="room-hero">
                <div className="room-hero-gallery">
                    <img
                        src={getImageUrl(images[activeImgIdx].url)}
                        alt={room.name}
                        className="hero-main-img"
                    />
                    <div className="gallery-overlay">
                        <div className="container">
                            <button className="back-link-btn" onClick={() => navigate(-1)}>
                                <i className="fa-solid fa-arrow-left"></i> Back to Hotel
                            </button>
                        </div>
                    </div>
                </div>

                <div className="room-hero-thumbnails container">
                    {images.map((img: any, idx: number) => (
                        <div
                            key={img.id || idx}
                            className={`thumb-card ${idx === activeImgIdx ? 'active' : ''}`}
                            onClick={() => setActiveImgIdx(idx)}
                        >
                            <img src={getImageUrl(img.url)} alt={`View ${idx + 1}`} />
                        </div>
                    ))}
                </div>
            </section>

            <main className="room-main-content container">
                <div className="room-grid-layout">

                    {/* LEFT CONTENT */}
                    <div className="room-info-column">
                        <div className="room-header-box">
                            <div className="hotel-context">
                                <Link to={`/hotels/${hotelId}`} className="hotel-link">
                                    {hotel.name}
                                </Link>
                                <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px' }}></i>
                                <span>{hotel.city}</span>
                            </div>

                            <h1 className="room-title">{room.name}</h1>

                            <div className="room-badges">
                                <span className="badge-luxury">Luxury Suite</span>
                                <div className="hotel-stars">
                                    {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
                                        <i key={i} className="fa-solid fa-star" style={{ color: '#ffb800' }}></i>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* KEY SPECS */}
                        <div className="room-specs-strip">
                            <div className="spec-item">
                                <i className="fa-solid fa-ruler-combined"></i>
                                <div>
                                    <label>Size</label>
                                    <strong>{room.roomSizeM2 || '45'} m²</strong>
                                </div>
                            </div>
                            <div className="spec-item">
                                <i className="fa-solid fa-user"></i>
                                <div>
                                    <label>Adults</label>
                                    <strong>Max {room.maxAdults}</strong>
                                </div>
                            </div>
                            <div className="spec-item">
                                <i className="fa-solid fa-child"></i>
                                <div>
                                    <label>Children</label>
                                    <strong>Max {room.maxChildren || 0}</strong>
                                </div>
                            </div>
                            <div className="spec-item">
                                <i className="fa-solid fa-bed"></i>
                                <div>
                                    <label>Bed Type</label>
                                    <strong>{room.bedType || 'King Bed'}</strong>
                                </div>
                            </div>
                            {/* <div className="spec-item">
                                <i className="fa-solid fa-mountain-sun"></i>
                                <div>
                                    <label>View</label>
                                    <strong>Mountain View</strong>
                                </div>
                            </div> */}
                        </div>

                        <div className="room-description-section">
                            <h3>Description</h3>
                            <p>{room.description || 'Experience a blend of luxury and comfort in this meticulously designed suite.'}</p>
                        </div>

                        <div className="room-amenities-section">
                            <h3>Room Features & Amenities</h3>
                            <div className="amenities-grid">
                                {room.roomAmenities && room.roomAmenities.length > 0 ? (
                                    room.roomAmenities.map((am: any) => (
                                        <div key={am.id} className="am-item">
                                            <i className={getAmenityIcon(am.amenityName)}></i>
                                            {am.amenityName}
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="am-item"><i className="fa-solid fa-wifi"></i> Free High-speed WiFi</div>
                                        <div className="am-item"><i className="fa-solid fa-snowflake"></i> Air Conditioning</div>
                                        <div className="am-item"><i className="fa-solid fa-tv"></i> Smart TV</div>
                                        <div className="am-item"><i className="fa-solid fa-vault"></i> Private Safe</div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* NEW: Map Section below Amenities */}
                        <div className="room-location-section" style={{ marginTop: '40px' }}>
                            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>Location</h3>
                            <a 
                                className="premium-card clickable-map-horizontal" 
                                href={hotel.latitude && hotel.longitude ? `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.city}`)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0',
                                    padding: '0',
                                    overflow: 'hidden',
                                    borderRadius: '24px',
                                    border: '1px solid #e2e8f0',
                                    textDecoration: 'none',
                                    background: 'white',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
                                }}
                            >
                                <div className="map-embed-large" style={{ height: '300px', width: '100%', position: 'relative' }}>
                                    {hotel.latitude && hotel.longitude ? (
                                        <iframe title="Map" width="100%" height="100%" style={{ border: 0, pointerEvents: 'none' }} loading="lazy" src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}></iframe>
                                    ) : (
                                        <iframe title="Map" width="100%" height="100%" style={{ border: 0, pointerEvents: 'none' }} loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(`${hotel.name}, ${hotel.city}`)}&z=15&output=embed`}></iframe>
                                    )}
                                    <div className="map-visual-overlay" style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'rgba(106, 40, 199, 0.03)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <div className="map-marker-ping" style={{
                                            width: '20px', height: '20px', background: '#6a28c7', borderRadius: '50%',
                                            boxShadow: '0 0 0 10px rgba(106, 40, 199, 0.1)'
                                        }}></div>
                                        <span className="map-action-hint" style={{
                                            marginTop: '12px', background: 'white', padding: '6px 14px', borderRadius: '20px',
                                            fontSize: '11px', fontWeight: '800', color: '#6a28c7', textTransform: 'uppercase'
                                        }}>View on Google Maps</span>
                                    </div>
                                </div>
                                <div className="map-horizontal-info" style={{ padding: '24px' }}>
                                    <div className="location-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6a28c7', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        <i className="fa-solid fa-location-dot"></i>
                                        <span>{hotel.city}, Azerbaijan</span>
                                    </div>
                                    <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>{hotel.name}</h4>
                                    <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>{hotel.address || 'Shusha, Karabakh'}</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR (BOOKING CARD) */}
                    <aside className="room-booking-sidebar">
                        <div className="booking-sticky-card">
                            <div className="card-header">
                                <div className="tax-notice">Includes all taxes and fees</div>
                                <div className="price-tag">
                                    {previewLoading ? (
                                        <div className="preview-loading-state">
                                            <i className="fa-solid fa-spinner fa-spin"></i>
                                            <span>Calculating live rates...</span>
                                        </div>
                                    ) : previewError ? (
                                        <div className="preview-error-state">
                                            <i className="fa-solid fa-triangle-exclamation"></i>
                                            <span>{previewError}</span>
                                        </div>
                                    ) : previewData ? (
                                        <div className="daily-breakdown">
                                            <div className="breakdown-list">
                                                {previewData.pricingResult?.breakdowns?.[0]?.log.map((day: any, idx: number) => (
                                                    <div key={idx} className="breakdown-item">
                                                        <span className="day-date">{new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                                        <span className="day-price">₼{day.finalPrice}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="total-summary">
                                                <span className="label">Total for {previewData.pricingResult?.breakdowns?.[0]?.log.length} nights:</span>
                                                <span className="amount">₼{previewData.exactTotal}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="amount">₼{room.basePrice || '---'}</span>
                                            <span className="period">/ night</span>
                                            {(checkIn && checkOut) && (
                                                <div className="preview-hint">
                                                    <i className="fa-solid fa-circle-info"></i>
                                                    Select valid dates to see breakdown
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="booking-dates-selector">
                                <div className="date-field">
                                    <label><i className="fa-regular fa-calendar"></i> CHECK-IN</label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                    />
                                </div>
                                <div className="date-field">
                                    <label><i className="fa-regular fa-calendar"></i> CHECK-OUT</label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="booking-guests-selector">
                                <div className="guest-selector-item">
                                    <div className="guest-label">
                                        <i className="fa-solid fa-user"></i>
                                        <span>Adults</span>
                                    </div>
                                    <div className="guest-controls">
                                        <button 
                                            onClick={() => setAdults(Math.max(1, adults - 1))}
                                            disabled={adults <= 1}
                                        >-</button>
                                        <span>{adults}</span>
                                        <button 
                                            onClick={() => setAdults(Math.min(room.maxAdults || 10, adults + 1))}
                                            disabled={adults >= (room.maxAdults || 10)}
                                        >+</button>
                                    </div>
                                </div>
                                <div className="guest-selector-item">
                                    <div className="guest-label">
                                        <i className="fa-solid fa-child"></i>
                                        <span>Children</span>
                                    </div>
                                    <div className="guest-controls">
                                        <button 
                                            onClick={() => setChildren(Math.max(0, children - 1))}
                                            disabled={children <= 0}
                                        >-</button>
                                        <span>{children}</span>
                                        <button 
                                            onClick={() => setChildren(Math.min(room.maxChildren || 5, children + 1))}
                                            disabled={children >= (room.maxChildren || 5)}
                                        >+</button>
                                    </div>
                                </div>
                            </div>

                            <button className="reserve-btn-primary" onClick={handleReserve}>
                                Reserve This Room
                            </button>

                            {/* <p className="no-prepay">No pre-payment required for booking</p>

                            <hr className="card-divider" />

                            <div className="sidebar-hotel-card">
                                <img src={getImageUrl(hotel.images?.[0]?.url)} alt={hotel.name} />
                                <div>
                                    <h4>{hotel.name}</h4>
                                    <p><i className="fa-solid fa-location-dot"></i> {hotel.city}, Azerbaijan</p>
                                </div>
                            </div> */}
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
};
