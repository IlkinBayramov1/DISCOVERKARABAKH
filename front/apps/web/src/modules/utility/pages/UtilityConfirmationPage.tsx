import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { utilityApi } from '../api/utility.api';
import { CheckCircle, ShieldCheck, Download, CreditCard, Flame, Zap, Droplet, Clock } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import logoImg from '../../../assets/dk logo main3.png';
import '../../booking/pages/BookingConfirmation/BookingConfirmation.css';

export default function UtilityConfirmationPage() {
    const { paymentId } = useParams<{ paymentId: string }>();
    const navigate = useNavigate();
    
    const [payment, setPayment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const receiptRef = useRef<HTMLDivElement>(null);

    const fetchPaymentDetails = async () => {
        if (!paymentId) return;
        setLoading(true);
        try {
            const res = await utilityApi.getPaymentDetails(paymentId);
            setPayment(res.data.data);
        } catch (err: any) {
            setError(err.message || 'Ödəniş məlumatları yüklənərkən xəta baş verdi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentDetails();
    }, [paymentId]);

    const handleConfirmPayment = async () => {
        if (!paymentId) return;
        setProcessing(true);
        try {
            const res = await utilityApi.completePayment(paymentId);
            setPayment(res.data.data);
        } catch (err: any) {
            alert(err.message || 'Ödəniş təsdiqlənərkən xəta baş verdi.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!receiptRef.current) return;
        setDownloading(true);
        
        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                useCORS: true,
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
                        qrCorner.style.top = '160px'; 
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
            pdf.save(`DK_Utility_Receipt_${payment?.transactionId || 'Payment'}.pdf`);
        } catch (err) {
            console.error('PDF Generation Error:', err);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="dk-bc-loading-layout">
                <div className="spin-loader"></div>
                <p>Ödəniş protokolu yüklənir...</p>
            </div>
        );
    }

    if (error || !payment) {
        return (
            <div className="dk-bc-error-layout">
                <div className="dk-bc-error-card">
                    <div className="error-icon">!</div>
                    <h2>Xəta baş verdi</h2>
                    <p>{error || 'Ödəniş məlumatları tapılmadı.'}</p>
                    <button onClick={() => navigate('/utility')} className="dk-btn-primary full-width">
                        Kommunal Ödənişlərə Qayıt
                    </button>
                </div>
            </div>
        );
    }

    const { 
        transactionId = 'N/A', 
        totalAmount = 0, 
        paymentStatus = 'pending', 
        paymentMethod = 'DiscoverKarabakh Wallet',
        abonentCode = 'N/A',
        abonentName = 'Qeydiyyatsız Abonent',
        items = [] 
    } = payment;

    // Determine utility type from first item to display correct logo/styling
    const utilityType = items[0]?.utilityType || 'gas';

    const getUtilityIcon = () => {
        switch (utilityType) {
            case 'gas':
                return <Flame size={56} className="banner-icon" style={{ color: '#f97316', backgroundColor: '#ffedd5', boxShadow: '0 8px 20px rgba(249, 115, 22, 0.15)' }} />;
            case 'water':
                return <Droplet size={56} className="banner-icon" style={{ color: '#0ea5e9', backgroundColor: '#e0f2fe', boxShadow: '0 8px 20px rgba(14, 165, 233, 0.15)' }} />;
            case 'electricity':
                return <Zap size={56} className="banner-icon" style={{ color: '#eab308', backgroundColor: '#fef9c3', boxShadow: '0 8px 20px rgba(234, 179, 8, 0.15)' }} />;
            default:
                return <Flame size={56} className="banner-icon" />;
        }
    };

    const getProviderName = () => {
        switch (utilityType) {
            case 'gas': return 'Azəriqaz';
            case 'water': return 'Azərsu';
            case 'electricity': return 'Azərişıq';
            default: return 'Kommunal Xidmət';
        }
    };

    const isCompleted = paymentStatus === 'completed';

    return (
        <div className="dk-bc-layout">
            <div className="dk-bc-container">
                
                {/* RECEIPT PAPER START */}
                <div className="dk-bc-receipt-card" ref={receiptRef}>
                    
                    {/* PDF Header */}
                    <div className="pdf-only dk-pdf-header">
                        <img src={logoImg} alt="Discover Karabakh" className="pdf-logo" />
                        <div className="pdf-header-text">
                            <h4>Rəsmi Kommunal Ödəniş Qəbzi</h4>
                            <p>{new Date(payment.createdAt).toLocaleString('en-GB')}</p>
                        </div>
                    </div>

                    {/* QR Code corner for verified status */}
                    {isCompleted && (
                        <div className="dk-bc-qr-corner">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${transactionId}&color=0f172a`} 
                                alt="Authorization QR Code" 
                            />
                            <span>Doğruluğu Yoxla</span>
                        </div>
                    )}

                    {/* HEADER STATUS */}
                    <div className="dk-bc-success-banner">
                        {isCompleted ? (
                            <>
                                <CheckCircle size={56} className="banner-icon" strokeWidth={1.5} />
                                <h1>Ödəniş Təsdiqləndi!</h1>
                                <p>Kommunal ödənişiniz uğurla tamamlandı. Rəsmi dövlət bildirişi 24 saat ərzində yenilənəcək.</p>
                            </>
                        ) : (
                            <>
                                <Clock size={56} className="banner-icon" strokeWidth={1.5} style={{ color: '#f59e0b', backgroundColor: '#fef3c7', boxShadow: '0 8px 20px rgba(245, 158, 11, 0.15)' }} />
                                <h1>Ödəniş Gözləmədədir</h1>
                                <p>Zəhmət olmasa abonent və borc məlumatlarını yoxlayıb ödənişi təsdiq edin.</p>
                            </>
                        )}
                    </div>
                    
                    {/* CONFIRMATION CODE & ACTIONS */}
                    <div className="dk-bc-header-row">
                        <div className="booking-id-block">
                            <span className="label">Tranzaksiya ID</span>
                            <span className="value" style={{ fontSize: '16px' }}>{transactionId || 'Gözlənilir...'}</span>
                        </div>
                        {isCompleted && (
                            <button 
                                onClick={handleDownloadPDF}
                                disabled={downloading}
                                className={`dk-btn-download no-print ${downloading ? 'disabled' : ''}`}
                            >
                                {downloading ? <div className="spin-loader small"></div> : <Download size={18} />}
                                {downloading ? 'Generasiya olunur...' : 'PDF Yüklə'}
                            </button>
                        )}
                    </div>

                    <div className="dk-bc-divider"></div>

                    {/* OVERVIEW SECTION */}
                    <div className="dk-bc-section">
                        <h2 className="section-title">Abonent və Xidmət Məlumatı</h2>
                        
                        <div className="dk-bc-overview-grid">
                            <div className="property-info">
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {getUtilityIcon()}
                                    {getProviderName()}
                                </h3>
                                <p className="location-text" style={{ fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>
                                    Abonent Kodu: {abonentCode}
                                </p>
                                <p className="room-text" style={{ fontSize: '15px', color: '#334155' }}>
                                    Ad Soyad: {abonentName}
                                </p>
                            </div>
                            
                            <div className="dk-bc-date-box">
                                <div className="date-col">
                                    <span className="date-label">Ödəniş Tarixi</span>
                                    <span className="date-value">
                                        {new Date(payment.createdAt).toLocaleDateString('az-AZ', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BILL ITEMS */}
                    <div className="dk-bc-divider"></div>
                    <div className="dk-bc-section">
                        <h2 className="section-title">Ödənilən Borclar</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {items.map((item: any, idx: number) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div>
                                        <span style={{ fontWeight: 700, textTransform: 'capitalize', color: '#1e293b' }}>
                                            {item.utilityType === 'gas' ? 'Qaz Borcu' : item.utilityType === 'water' ? 'Su Borcu' : 'İşıq Borcu'}
                                        </span>
                                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                            Dövr: {item.billingMonth}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 800, color: '#0f172a' }}>
                                        {item.amountPaid.toFixed(2)} AZN
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dk-bc-divider"></div>

                    {/* FINANCIAL SUMMARY */}
                    <div className="dk-bc-section">
                        <h2 className="section-title">Maliyyə Xülasəsi</h2>
                        
                        <div className="dk-bc-payment-row">
                            <span className="pay-label">Ödəniş Statusu</span>
                            <span className={`pay-value capitalize ${isCompleted ? 'success' : 'warning'}`}>
                                {isCompleted ? 'Uğurlu (Paid)' : 'Gözləmədə (Pending)'}
                            </span>
                        </div>
                        
                        <div className="dk-bc-payment-row">
                            <span className="pay-label">Ödəniş Metodu</span>
                            <span className="pay-value font-medium">{paymentMethod || 'DiscoverKarabakh Wallet'}</span>
                        </div>

                        <div className="dk-bc-total-row">
                            <span className="total-label">Toplam Ödənilən</span>
                            <span className="total-value">
                                {totalAmount.toFixed(2)} <span className="currency">AZN</span>
                            </span>
                        </div>
                    </div>

                    {/* PDF Footer */}
                    <div className="pdf-only dk-pdf-footer">
                        <div className="pdf-security-badge">
                            <ShieldCheck size={16} /> Rəsmi Təsdiq Protokolu
                        </div>
                        <p>Dəstək Xidməti: support@discoverkarabakh.com</p>
                        <p>Discover Karabakh tərəfindən təhlükəsiz şəkildə yaradılmışdır.</p>
                        <span className="pdf-watermark">Discover Karabakh Operations</span>
                    </div>

                    {/* PENDING PAYMENT ACTION BUTTON */}
                    {!isCompleted && (
                        <div className="no-print" style={{ marginTop: '30px' }}>
                            <button
                                onClick={handleConfirmPayment}
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                                    color: 'white',
                                    padding: '18px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    fontWeight: 800,
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <CreditCard size={20} />
                                {processing ? 'Ödəniş emal edilir...' : 'ÖDƏNİŞİ TƏSDİQLƏ (SUCCESS)'}
                            </button>
                        </div>
                    )}

                </div>
                {/* RECEIPT PAPER END */}

                {/* BOTTOM ACTIONS */}
                <div className="dk-bc-bottom-actions no-print">
                    <button onClick={() => navigate('/utility')} className="dk-btn-ghost">
                        Provayder Seçiminə Qayıt
                    </button>
                    <button onClick={() => navigate('/account/trips')} className="dk-btn-dark">
                        Səyahətlərimə Keç
                    </button>
                </div>

            </div>
        </div>
    );
}
