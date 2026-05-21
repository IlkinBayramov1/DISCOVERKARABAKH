import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '../../api/booking.api';
import { CheckCircle, MapPin, Download, ShieldCheck, Users, Home } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import logoImg from '../../../../assets/dk logo main3.png'; // Yolunuzu yoxlayın
import './BookingConfirmation.css'; // Yeni DK CSS

export const BookingConfirmationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);
    const receiptRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (!receiptRef.current) return;
        setDownloading(true);
        
        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2, // 2 is optimal for crisp text without generating massive file sizes
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 1024, // 1. FORCE DESKTOP LAYOUT even if user is on mobile
                onclone: (clonedDoc) => {
                    const receiptCard = clonedDoc.querySelector('.dk-bc-receipt-card') as HTMLElement;
                    if (receiptCard) {
                        // Lock dimensions so mobile CSS media queries don't ruin the PDF
                        receiptCard.style.width = '800px'; 
                        receiptCard.style.maxWidth = 'none';
                        receiptCard.style.padding = '48px'; 
                    }

                    const pdfElements = clonedDoc.querySelectorAll('.pdf-only');
                    pdfElements.forEach(el => {
                        (el as HTMLElement).style.display = 'flex';
                    });
                    
                    const noPrintElements = clonedDoc.querySelectorAll('.no-print');
                    noPrintElements.forEach(el => {
                        (el as HTMLElement).style.display = 'none';
                    });

                    // 2. FIX QR CODE OVERLAP
                    const qrCorner = clonedDoc.querySelector('.dk-bc-qr-corner') as HTMLElement;
                    if (qrCorner) {
                        qrCorner.style.position = 'absolute';
                        qrCorner.style.top = '160px'; // Pushes it safely below the PDF header
                        qrCorner.style.right = '48px';
                        qrCorner.style.margin = '0';
                    }
                }
            });
            
            const imgData = canvas.toDataURL('image/png');
            
            // 3. DYNAMIC RECEIPT SIZING (Fixed TypeScript Error)
            const pdfWidth = 210; // Standard A4 width in mm
            const padding = 15;   // 15mm padding on all sides
            const contentWidth = pdfWidth - (padding * 2);
            
            // Use the canvas dimensions directly instead of pdf.getImageProperties!
            const contentHeight = (canvas.height * contentWidth) / canvas.width;
            const pdfHeight = contentHeight + (padding * 2);
            
            // Create a custom sized PDF! 
            const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
            
            pdf.addImage(imgData, 'PNG', padding, padding, contentWidth, contentHeight, undefined, 'FAST');
            pdf.save(`DK_Booking_${booking?.bookingNumber || 'Receipt'}.pdf`);
        } catch (err) {
            console.error('PDF Generation Error:', err);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => {
        const fetchConfirmation = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const res = await bookingApi.getBookingDetails(id);
                const fetchedBooking = (res as any).data || res;
                setBooking(fetchedBooking);
            } catch (err: any) {
                setError(err.message || 'Failed to load booking confirmation');
            } finally {
                setLoading(false);
            }
        };
        fetchConfirmation();
    }, [id]);

    if (loading) {
        return (
            <div className="dk-bc-loading-layout">
                <div className="spin-loader"></div>
                <p>Retrieving your reservation protocol...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="dk-bc-error-layout">
                <div className="dk-bc-error-card">
                    <div className="error-icon">!</div>
                    <h2>Wait, something went wrong</h2>
                    <p>{error || 'Booking could not be loaded.'}</p>
                    <button onClick={() => navigate('/')} className="dk-btn-primary full-width">
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }

    const { 
        bookingNumber = 'N/A', 
        bookingType = 'hotel',
        status = 'pending', 
        paymentStatus = 'pending', 
        paymentMethod = 'DiscoverKarabakh Wallet',
        totalPrice = 0, 
        currency = 'AZN',
        hotel, 
        Tour,
        tour,
        attraction,
        Event,
        items = [], 
        guests = [] 
    } = booking;
  
    const primaryItem = items.length > 0 ? items[0] : null;
    const primaryGuest = guests.length > 0 ? guests[0] : null;
    const totalPax = primaryItem ? (primaryItem.adults + (primaryItem.children || 0)) : 0;
    const guestInitial = primaryGuest?.firstName?.[0] || primaryGuest?.email?.[0]?.toUpperCase() || 'G';

    let details: any = null;
    let sectionTitle = 'Stay Overview';
    let itemName = 'Your Reservation';
    let locationName = 'Address not provided';
    let dateLabel = 'Date';
    let exploreLink = '/';
    let exploreLinkText = 'properties';
    let participantLabel = 'Participants';

    if (bookingType === 'hotel') {
        details = hotel;
        sectionTitle = 'Stay Overview';
        itemName = details?.name || 'Your Hotel';
        locationName = details?.address || details?.city || 'Address not provided';
        dateLabel = 'Check-in';
        exploreLink = '/hotels';
        exploreLinkText = 'properties';
    } else if (bookingType === 'tour') {
        details = Tour || tour;
        sectionTitle = 'Adventure Overview';
        itemName = details?.name || 'Your Tour';
        locationName = details?.address || details?.city || 'Address not provided';
        dateLabel = 'Expedition Date';
        exploreLink = '/tours';
        exploreLinkText = 'adventures';
        participantLabel = 'Explorers Selected';
    } else if (bookingType === 'attraction') {
        details = attraction;
        sectionTitle = 'Attraction Overview';
        itemName = details?.name || 'Your Attraction';
        locationName = details?.address || details?.city || 'Address not provided';
        dateLabel = 'Visit Date';
        exploreLink = '/attractions';
        exploreLinkText = 'destinations';
        participantLabel = 'Visitors';
    } else if (bookingType === 'event') {
        details = Event;
        sectionTitle = 'Event Overview';
        itemName = details?.title || 'Your Event';
        locationName = details?.location || details?.city || 'Address not provided';
        dateLabel = 'Event Date';
        exploreLink = '/events';
        exploreLinkText = 'events';
        participantLabel = 'Attendees';
    } else if (bookingType === 'transfer') {
        const meta = primaryItem?.meta;
        sectionTitle = 'Transfer Overview';
        itemName = 'Professional Transfer';
        locationName = meta?.pickupLocation?.address 
            ? `${meta.pickupLocation.address} → ${meta.dropoffLocation?.address || '...'}`
            : 'Address details available in itinerary';
        dateLabel = 'Pickup Schedule';
        exploreLink = '/transport/passenger';
        exploreLinkText = 'rides';
        participantLabel = 'Passengers';
    }

    return (
        <div className="dk-bc-layout">
            <div className="dk-bc-container">
                
                {/* RECEIPT PAPER START */}
                <div className="dk-bc-receipt-card" ref={receiptRef}>
                    
                    {/* PDF Header (Hidden in Web, Shown in PDF) */}
                    <div className="pdf-only dk-pdf-header">
                        <img src={logoImg} alt="Discover Karabakh" className="pdf-logo" />
                        <div className="pdf-header-text">
                            <h4>Official Reservation Receipt</h4>
                            <p>{new Date().toLocaleString('en-GB')}</p>
                        </div>
                    </div>

                    {/* NEW: QR CODE FOR AUTHORIZATION */}
                    <div className="dk-bc-qr-corner">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${bookingNumber}&color=0f172a`} 
                            alt="Authorization QR Code" 
                        />
                        <span>Scan to Verify</span>
                    </div>

                    {/* SUCCESS BANNER */}
                    <div className="dk-bc-success-banner">
                        <CheckCircle size={56} className="banner-icon" strokeWidth={1.5} />
                        <h1>Booking Confirmed!</h1>
                        <p>Your reservation is secure. A digital copy has been sent to your email.</p>
                    </div>
                    
                    {/* HEADER ROW: BOOKING ID & DOWNLOAD */}
                    <div className="dk-bc-header-row">
                        <div className="booking-id-block">
                            <span className="label">Confirmation Protocol</span>
                            <span className="value">#{bookingNumber}</span>
                        </div>
                        <button 
                            onClick={handleDownloadPDF}
                            disabled={downloading}
                            className={`dk-btn-download no-print ${downloading ? 'disabled' : ''}`}
                        >
                            {downloading ? <div className="spin-loader small"></div> : <Download size={18} />}
                            {downloading ? 'Generating...' : 'Download PDF'}
                        </button>
                    </div>

                    <div className="dk-bc-divider"></div>

                    {/* OVERVIEW SECTION */}
                    <div className="dk-bc-section">
                        <h2 className="section-title">
                            {sectionTitle}
                        </h2>
                        
                        <div className="dk-bc-overview-grid">
                            <div className="property-info">
                                <h3>{itemName}</h3>
                                <p className="location-text">
                                    <MapPin size={16} />
                                    {locationName}
                                </p>
                                {bookingType === 'hotel' && primaryItem?.roomType && (
                                    <p className="room-text">
                                        <Home size={14}/> Room: {primaryItem.roomType.name}
                                    </p>
                                )}
                                {bookingType !== 'hotel' && primaryItem && (
                                    <p className="room-text">
                                        <Users size={14}/> {totalPax} {participantLabel}
                                    </p>
                                )}
                            </div>
                            
                            <div className="dk-bc-date-box">
                                <div className="date-col">
                                    <span className="date-label">{dateLabel}</span>
                                    <span className="date-value">
                                        {primaryItem?.checkIn ? (
                                            (bookingType === 'hotel' || bookingType === 'tour' || bookingType === 'attraction') 
                                                ? new Date(primaryItem.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                                : new Date(primaryItem.checkIn).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                        ) : 'N/A'}
                                    </span>
                                    {/* Time labels removed by user request */}
                                </div>
                                {bookingType === 'hotel' && primaryItem?.checkOut && (
                                    <>
                                        <div className="date-divider"></div>
                                        <div className="date-col">
                                            <span className="date-label">Check-out</span>
                                            <span className="date-value">{new Date(primaryItem.checkOut).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</span>
                                            {/* Time label removed by user request */}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* GUEST SECTION */}
                    {primaryGuest && (
                        <div className="dk-bc-guest-box">
                            <div className="guest-avatar">{guestInitial}</div>
                            <div className="guest-details">
                                <h4>{primaryGuest.firstName} {primaryGuest.lastName}</h4>
                                <p>{primaryGuest.email}</p>
                                {primaryGuest.phone && <p className="guest-phone">{primaryGuest.phone}</p>}
                            </div>
                            <div className="guest-status">
                                <span className={`status-pill ${status}`}>
                                    {status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="dk-bc-divider"></div>

                    {/* PAYMENT SUMMARY SECTION */}
                    <div className="dk-bc-section">
                        <h2 className="section-title">Financial Summary</h2>
                        
                        <div className="dk-bc-payment-row">
                            <span className="pay-label">Payment Status</span>
                            <span className={`pay-value capitalize ${paymentStatus === 'captured' || paymentStatus === 'success' ? 'success' : 'warning'}`}>
                                {paymentStatus}
                            </span>
                        </div>
                        
                        <div className="dk-bc-payment-row">
                            <span className="pay-label">Transaction Method</span>
                            <span className="pay-value font-medium">{paymentMethod || 'Secure Checkout'}</span>
                        </div>

                        <div className="dk-bc-total-row">
                            <span className="total-label">Total Charged</span>
                            <span className="total-value">
                                {typeof totalPrice === 'number' ? totalPrice.toFixed(2) : totalPrice} <span className="currency">{currency}</span>
                            </span>
                        </div>
                    </div>

                    {/* PDF Footer (Hidden in Web) */}
                    <div className="pdf-only dk-pdf-footer">
                        <div className="pdf-security-badge">
                            <ShieldCheck size={16} /> Official Digital Protocol
                        </div>
                        <p>Support Contact: support@discoverkarabakh.com</p>
                        <p>Please present this digital receipt upon arrival.</p>
                        <span className="pdf-watermark">Generated securely by Discover Karabakh Operations</span>
                    </div>

                </div>
                {/* RECEIPT PAPER END */}

                {/* BOTTOM ACTIONS (Hidden in PDF) */}
                <div className="dk-bc-bottom-actions no-print">
                    <button onClick={() => navigate(exploreLink)} className="dk-btn-ghost">
                        Explore more {exploreLinkText}
                    </button>
                    <button onClick={() => navigate('/account/trips')} className="dk-btn-dark">
                        View My Itineraries
                    </button>
                </div>

            </div>
        </div>
    );
};