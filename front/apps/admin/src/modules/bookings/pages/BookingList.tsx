import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Search, ChevronLeft, ChevronRight, X, 
    Download, Eye, Users, MapPin, Ticket, ShieldCheck, 
    Home, CheckCircle, RefreshCw
} from 'lucide-react';
import { useBookings, useBookingDetails } from '../hooks/useBookingManagement';
import { businessAdminApi } from '../../businesses/api/business.admin.api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import logoImg from '../../../assets/dk logo main3.png';
import './BookingList.css';

const BookingList: React.FC = () => {
    // Filters State
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'hotel' | 'tour' | 'attraction' | 'vehicle'>('all');
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    
    // Details Modal State
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [qrLoaded, setQrLoaded] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);
    const receiptRef = useRef<HTMLDivElement>(null);

    // Business Companies State
    const [companies, setCompanies] = useState<any[]>([]);
    const [companiesLoading, setCompaniesLoading] = useState<boolean>(false);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset pagination when category, company or status filters change
    useEffect(() => {
        setPage(1);
    }, [categoryFilter, selectedCompanyId, statusFilter]);

    // Load active businesses based on category to filter bookings
    useEffect(() => {
        setCompanies([]);
        setSelectedCompanyId('');

        if (categoryFilter === 'all') return;

        const fetchCompanies = async () => {
            setCompaniesLoading(true);
            try {
                const apiType = categoryFilter === 'vehicle' ? 'transport' : categoryFilter;
                const res = await businessAdminApi.getAllBusinesses(apiType as any, 'active');
                setCompanies(res?.data || res || []);
            } catch (err) {
                console.error('Error fetching companies:', err);
            } finally {
                setCompaniesLoading(false);
            }
        };
        fetchCompanies();
    }, [categoryFilter]);

    // Query params memo
    const queryParams = useMemo(() => {
        const p: any = {
            page,
            limit: 10,
        };
        if (categoryFilter !== 'all') {
            p.type = categoryFilter === 'vehicle' ? 'transfer' : categoryFilter;
        }
        if (statusFilter !== 'all') {
            p.status = statusFilter;
        }
        if (selectedCompanyId) {
            p.entityId = selectedCompanyId;
        }
        if (debouncedSearch) {
            p.search = debouncedSearch;
        }
        return p;
    }, [categoryFilter, statusFilter, selectedCompanyId, debouncedSearch, page]);

    const { data: listRes, isLoading: listLoading } = useBookings(queryParams);
    const { data: detailRes, isLoading: detailLoading } = useBookingDetails(selectedBookingId || '');

    const bookings = listRes?.data || [];
    const pagination = listRes?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };
    const bookingDetails = detailRes?.data;

    // Reset QR loaded state when opening a new booking
    useEffect(() => {
        setQrLoaded(false);
    }, [selectedBookingId]);

    // Format display date based on booking type
    const formatBookingDates = (booking: any) => {
        const firstItem = booking.bookingitem?.[0];
        if (!firstItem) return 'N/A';
        
        const type = booking.bookingType;
        
        if (type === 'hotel') {
            const checkIn = firstItem.checkIn ? new Date(firstItem.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
            const checkOut = firstItem.checkOut ? new Date(firstItem.checkOut).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
            return `${checkIn} - ${checkOut}`;
        } else if (type === 'transfer') {
            return firstItem.checkIn ? new Date(firstItem.checkIn).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
        } else {
            const dateStr = firstItem.checkIn ? new Date(firstItem.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
            const timeStr = firstItem.checkIn ? new Date(firstItem.checkIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
            return timeStr && timeStr !== '00:00' ? `${dateStr} (${timeStr})` : dateStr;
        }
    };

    // Helper to get name of booked entity
    const getBookedEntityName = (booking: any) => {
        if (booking.bookingType === 'hotel') return booking.hotel?.name || 'Unnamed Hotel';
        if (booking.bookingType === 'tour') return booking.tour?.name || 'Unnamed Tour';
        if (booking.bookingType === 'attraction') return booking.attraction?.name || 'Unnamed Attraction';
        if (booking.bookingType === 'event') return booking.event?.title || 'Unnamed Event';
        if (booking.bookingType === 'transfer') return booking.vehicle ? `${booking.vehicle.brand} ${booking.vehicle.model}` : 'Passenger Ride';
        return 'N/A';
    };

    // Helper to get formatted category name in Azerbaijani
    const getCategoryLabel = (type: string) => {
        const map: Record<string, string> = {
            hotel: 'Hotel',
            tour: 'Tur',
            attraction: 'Görməli Yer',
            event: 'Tədbir',
            transfer: 'Nəqliyyat',
            vehicle: 'Nəqliyyat'
        };
        return map[type.toLowerCase()] || type;
    };

    // Helper to render status badge
    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'confirmed' || s === 'success') return <Badge variant="success">Təsdiqlənib</Badge>;
        if (s === 'pending' || s === 'pending_payment') return <Badge variant="warning">Gözləyir</Badge>;
        if (s === 'cancelled' || s === 'rejected') return <Badge variant="error">Ləğv edilib</Badge>;
        return <Badge variant="neutral">{status}</Badge>;
    };

    // PDF Download Handler
    const handleDownloadPDF = async () => {
        if (!receiptRef.current || !bookingDetails) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 1024,
                onclone: (clonedDoc) => {
                    const receiptCard = clonedDoc.querySelector('.dk-bc-receipt-card') as HTMLElement;
                    if (receiptCard) {
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

                    const qrCorner = clonedDoc.querySelector('.dk-bc-qr-corner') as HTMLElement;
                    if (qrCorner) {
                        qrCorner.style.position = 'absolute';
                        qrCorner.style.top = '140px';
                        qrCorner.style.right = '48px';
                        qrCorner.style.margin = '0';
                    }
                }
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 210; 
            const padding = 15;   
            const contentWidth = pdfWidth - (padding * 2);
            const contentHeight = (canvas.height * contentWidth) / canvas.width;
            const pdfHeight = contentHeight + (padding * 2);
            
            const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
            pdf.addImage(imgData, 'PNG', padding, padding, contentWidth, contentHeight, undefined, 'FAST');
            pdf.save(`DK_Booking_${bookingDetails.bookingNumber || 'Receipt'}.pdf`);
        } catch (err) {
            console.error('PDF Generation Error:', err);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    // Booking Details Render logic in Modal
    const renderTicketDetails = () => {
        if (!bookingDetails) return null;

        const firstItem = bookingDetails.bookingitem?.[0];
        const primaryGuest = bookingDetails.guest?.[0];
        const guestInitial = primaryGuest?.firstName?.[0] || bookingDetails.user?.email?.[0]?.toUpperCase() || 'G';
        const totalPax = firstItem ? (firstItem.adults + (firstItem.children || 0)) : 0;
        
        let sectionTitle = 'Stay Overview';
        let locationName = bookingDetails.hotel?.address || bookingDetails.hotel?.city || 'Address not provided';
        let participantLabel = 'Participants';

        const bType = bookingDetails.bookingType;
        if (bType === 'tour') {
            sectionTitle = 'Adventure Overview';
            locationName = bookingDetails.tour?.address || bookingDetails.tour?.city || 'Address not provided';
            participantLabel = 'Explorers Selected';
        } else if (bType === 'attraction') {
            sectionTitle = 'Attraction Overview';
            locationName = bookingDetails.attraction?.address || bookingDetails.attraction?.city || 'Address not provided';
            participantLabel = 'Visitors';
        } else if (bType === 'event') {
            sectionTitle = 'Event Overview';
            locationName = bookingDetails.event?.location || bookingDetails.event?.city || 'Address not provided';
            participantLabel = 'Attendees';
        } else if (bType === 'transfer') {
            sectionTitle = 'Transfer Overview';
            locationName = 'Professional Ride Transfer';
            participantLabel = 'Passengers';
        }

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${bookingDetails.bookingNumber}&color=0f172a`;

        return (
            <div className="dk-bc-receipt-card" ref={receiptRef}>
                {/* PDF Header (Hidden on Web) */}
                <div className="pdf-only dk-pdf-header">
                    <img src={logoImg} alt="Discover Karabakh" className="pdf-logo" />
                    <div className="pdf-header-text">
                        <h4>Official Reservation Receipt</h4>
                        <p>{new Date().toLocaleString('en-GB')}</p>
                    </div>
                </div>

                {/* QR Code Corner */}
                <div className="dk-bc-qr-corner">
                    <img 
                        src={qrUrl} 
                        alt="Authorization QR Code" 
                        crossOrigin="anonymous"
                        onLoad={() => setQrLoaded(true)}
                    />
                    <span>Scan to Verify</span>
                </div>

                {/* SUCCESS BANNER */}
                <div className="dk-bc-success-banner">
                    <CheckCircle size={44} className="banner-icon" strokeWidth={1.5} />
                    <h1>Booking Confirmed!</h1>
                    <p>Your reservation is secure in Discover Karabakh database.</p>
                </div>

                {/* HEADER ROW */}
                <div className="dk-bc-header-row">
                    <div className="booking-id-block">
                        <span className="label">Confirmation Protocol</span>
                        <span className="value">#{bookingDetails.bookingNumber}</span>
                    </div>
                    <button 
                        onClick={handleDownloadPDF}
                        disabled={downloading || !qrLoaded}
                        className={`dk-btn-download no-print ${(downloading || !qrLoaded) ? 'disabled' : ''}`}
                    >
                        {downloading ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                        ) : (
                            <Download size={16} />
                        )}
                        {downloading ? 'Generating...' : !qrLoaded ? 'Loading QR...' : 'Download PDF'}
                    </button>
                </div>

                <div className="dk-bc-divider"></div>

                {/* OVERVIEW SECTION */}
                <div className="dk-bc-section">
                    <h2 className="section-title">{sectionTitle}</h2>
                    <div className="dk-bc-overview-grid">
                        <div className="property-info">
                            <h3 className="font-extrabold text-slate-800 text-lg leading-tight mb-2">
                                {getBookedEntityName(bookingDetails)}
                            </h3>
                            <p className="location-text">
                                <MapPin size={14} />
                                {locationName}
                            </p>
                            {bType === 'hotel' && firstItem?.roomType && (
                                <p className="room-text">
                                    <Home size={14}/> Room: {firstItem.roomType.name || 'Standard'}
                                </p>
                            )}
                            {bType !== 'hotel' && firstItem && (
                                <p className="room-text">
                                    <Users size={14}/> {totalPax} {participantLabel}
                                </p>
                            )}
                        </div>
                        
                        <div className="dk-bc-date-box">
                            <div className="date-col">
                                <span className="date-label">Schedule Detail</span>
                                <span className="date-value">{formatBookingDates(bookingDetails)}</span>
                            </div>
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
                            {primaryGuest.phone && <p className="guest-phone text-xs text-slate-400 mt-0.5">{primaryGuest.phone}</p>}
                        </div>
                        <div className="guest-status">
                            <span className={`status-pill ${bookingDetails.status}`}>
                                {bookingDetails.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                    </div>
                )}

                <div className="dk-bc-divider"></div>

                {/* FINANCIAL SUMMARY */}
                <div className="dk-bc-section">
                    <h2 className="section-title">Financial Summary</h2>
                    
                    <div className="dk-bc-payment-row">
                        <span className="pay-label">Payment Status</span>
                        <span className={`pay-value capitalize ${bookingDetails.paymentStatus === 'captured' || bookingDetails.paymentStatus === 'success' ? 'success' : 'warning'}`}>
                            {bookingDetails.paymentStatus}
                        </span>
                    </div>
                    
                    <div className="dk-bc-payment-row">
                        <span className="pay-label">Transaction Method</span>
                        <span className="pay-value font-medium">{bookingDetails.paymentMethod || 'Wallet'}</span>
                    </div>

                    <div className="dk-bc-total-row">
                        <span className="total-label">Total Charged</span>
                        <span className="total-value">
                            {bookingDetails.totalPrice.toFixed(2)} <span className="currency">{bookingDetails.currency || '₼'}</span>
                        </span>
                    </div>
                </div>

                {/* Special Requests */}
                {bookingDetails.specialRequests && (
                    <div className="mt-4 p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Intelligence Notes</h4>
                        <p className="text-sm text-amber-700 italic">"{bookingDetails.specialRequests}"</p>
                    </div>
                )}

                {/* PDF Footer (Hidden on Web) */}
                <div className="pdf-only dk-pdf-footer">
                    <div className="pdf-security-badge">
                        <ShieldCheck size={14} /> Official Discover Karabakh Protocol
                    </div>
                    <p>Support Contact: support@discoverkarabakh.com</p>
                    <span className="pdf-watermark">Generated securely by Discover Karabakh Operations</span>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rezervasiyalar</h1>
                <p className="text-slate-500 font-medium mt-1">Platformadakı bütün sifarişləri, rezervasiya statuslarını, tarix və qəbzləri izləyin.</p>
            </div>

            {/* Filters panel */}
            <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Biznes Kateqoriyası</label>
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as any)}
                            className="w-full h-10 px-3 border border-slate-200 rounded-xl text-slate-700 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                        >
                            <option value="all">Bütün Kateqoriyalar</option>
                            <option value="hotel">Hotellər</option>
                            <option value="tour">Turlar</option>
                            <option value="attraction">Görməli Yerlər</option>
                            <option value="vehicle">Nəqliyyat (Transfer)</option>
                        </select>
                    </div>

                    {/* Company Filter */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Biznes / Şirkət</label>
                        <select 
                            value={selectedCompanyId}
                            onChange={(e) => setSelectedCompanyId(e.target.value)}
                            disabled={categoryFilter === 'all' || companiesLoading}
                            className="w-full h-10 px-3 border border-slate-200 rounded-xl text-slate-700 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-slate-100 disabled:opacity-50"
                        >
                            <option value="">{companiesLoading ? 'Yüklənir...' : categoryFilter === 'all' ? 'Kateqoriya seçin' : 'Bütün Şirkətlər'}</option>
                            {companies.map((comp) => (
                                <option key={comp.id} value={comp.id}>
                                    {comp.name || comp.title || `${comp.brand || ''} ${comp.model || ''}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sifariş Statusu</label>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full h-10 px-3 border border-slate-200 rounded-xl text-slate-700 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-slate-100"
                        >
                            <option value="all">Bütün Statuslar</option>
                            <option value="confirmed">Təsdiqlənib</option>
                            <option value="pending">Gözləyir (Pending)</option>
                            <option value="pending_payment">Ödəniş Gözləyir</option>
                            <option value="cancelled">Ləğv Edilib</option>
                            <option value="draft">Qaralama (Draft)</option>
                        </select>
                    </div>

                    {/* Search Field */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Axtarış</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Rezervasiya № və ya Müştəri email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-xl text-slate-700 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* List and Table */}
            {listLoading ? (
                <Card className="min-h-[400px] flex flex-col items-center justify-center text-center">
                    <RefreshCw className="w-8 h-8 text-slate-300 animate-spin mb-4" />
                    <p className="text-slate-400 font-medium">Rezervasiya dataları yüklənir...</p>
                </Card>
            ) : bookings.length === 0 ? (
                <Card className="min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                        <Ticket className="text-slate-300 w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Məlumat Tapılmadı</h3>
                    <p className="text-slate-400 font-medium max-w-xs mt-1">Seçilmiş filtrlərə uyğun heç bir rezervasiya tapılmadı.</p>
                    <Button 
                        className="mt-6" 
                        variant="secondary"
                        onClick={() => {
                            setCategoryFilter('all');
                            setSelectedCompanyId('');
                            setStatusFilter('all');
                            setSearchTerm('');
                        }}
                    >
                        Filtrləri Sıfırla
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    <Card className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                                    <th className="py-4 px-6">Rezervasiya №</th>
                                    <th className="py-4 px-6">Müştəri</th>
                                    <th className="py-4 px-6">Kateqoriya</th>
                                    <th className="py-4 px-6">Biznes / Məkan</th>
                                    <th className="py-4 px-6">Tarix & Saat</th>
                                    <th className="py-4 px-6">Məbləğ</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Əməliyyat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking: any) => (
                                    <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6 font-bold text-slate-700">
                                            #{booking.bookingNumber}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-800 text-sm">{booking.guest?.[0] ? `${booking.guest[0].firstName} ${booking.guest[0].lastName}` : 'Guest User'}</span>
                                                <span className="text-slate-400 text-xs mt-0.5">{booking.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm font-semibold text-slate-500">
                                            {getCategoryLabel(booking.bookingType)}
                                        </td>
                                        <td className="py-4 px-6 font-bold text-slate-800 text-sm max-w-[200px] truncate">
                                            {getBookedEntityName(booking)}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-medium text-slate-600">
                                            {formatBookingDates(booking)}
                                        </td>
                                        <td className="py-4 px-6 font-black text-slate-800 text-sm">
                                            {booking.totalPrice.toFixed(2)} {booking.currency || '₼'}
                                        </td>
                                        <td className="py-4 px-6">
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="gap-2"
                                                onClick={() => setSelectedBookingId(booking.id)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                Detallara Bax
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
                            <span className="text-sm font-medium text-slate-500">
                                Ümumi <strong>{pagination.total}</strong> rezervasiyadan <strong>{((page - 1) * 10) + 1}-{Math.min(page * 10, pagination.total)}</strong> aralığı göstərilir.
                            </span>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Əvvəlki
                                </Button>
                                <span className="text-sm font-bold text-slate-700 px-3">
                                    Səhifə {page} / {pagination.totalPages}
                                </span>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    disabled={page === pagination.totalPages}
                                    onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                >
                                    Növbəti
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Ticket & Receipt Modal */}
            {selectedBookingId && (
                <div className="dk-admin-modal-overlay" onClick={() => setSelectedBookingId(null)}>
                    <div className="dk-admin-modal-container" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="dk-admin-modal-header">
                            <div className="flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-slate-500" />
                                <h2 className="text-lg font-black text-slate-800">Rezervasiya Protokolu və Bilet</h2>
                            </div>
                            <button className="dk-admin-modal-close" onClick={() => setSelectedBookingId(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="dk-admin-modal-body">
                            {detailLoading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mb-4" />
                                    <p className="text-slate-500 font-medium">Bilet təfərrüatları yüklənir...</p>
                                </div>
                            ) : (
                                renderTicketDetails()
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;
