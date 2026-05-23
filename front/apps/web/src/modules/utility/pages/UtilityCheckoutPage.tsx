import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { utilityApi } from '../api/utility.api';
import { useAuth } from '../../../shared/context/AuthContext';
import { 
    CreditCard, 
    ArrowLeft, 
    ShieldCheck, 
    Flame, 
    Zap, 
    Droplet, 
    Loader2, 
    Wallet, 
    AlertCircle 
} from 'lucide-react';
import './UtilityCheckoutPage.css';

export default function UtilityCheckoutPage() {
    const { paymentId } = useParams<{ paymentId: string }>();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const balance = (user as any)?.balance ?? 0.0;

    const [payment, setPayment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            if (!paymentId) return;
            setLoading(true);
            try {
                const res = await utilityApi.getPaymentDetails(paymentId);
                const data = res.data.data;
                
                // If it is already completed, redirect directly to confirmation page
                if (data.paymentStatus === 'completed') {
                    navigate(`/utility-confirmation/${paymentId}`, { replace: true });
                    return;
                }
                
                setPayment(data);
            } catch (err: any) {
                setError(err.message || 'Ödəniş məlumatları yüklənərkən xəta baş verdi.');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [paymentId, navigate]);

    const handleConfirmPayment = async () => {
        if (!paymentId) return;
        
        const totalAmt = payment?.totalAmount || 0;
        if (balance < totalAmt) {
            alert('Balansınızda kifayət qədər vəsait yoxdur. Zəhmət olmasa pul kisəsindən balansınızı artırın.');
            return;
        }

        setProcessing(true);
        try {
            await utilityApi.completePayment(paymentId);
            await refreshUser(); // Refresh user balance in context
            navigate(`/utility-confirmation/${paymentId}`, { replace: true });
        } catch (err: any) {
            alert(err.message || 'Ödəniş icra edilərkən xəta baş verdi.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="dk-checkout-loading">
                <Loader2 className="spinner-anim" size={36} />
                <p>Ödəniş məlumatları gətirilir...</p>
            </div>
        );
    }

    if (error || !payment) {
        return (
            <div className="dk-checkout-error">
                <AlertCircle size={48} className="error-icon" />
                <h2>Xəta baş verdi</h2>
                <p>{error || 'Ödəniş məlumatları tapılmadı.'}</p>
                <Link to="/utility" className="back-btn-link">
                    Kommunal Xidmətlərə Qayıt
                </Link>
            </div>
        );
    }

    const { 
        totalAmount = 0, 
        abonentCode = 'N/A', 
        abonentName = 'Qeydiyyatsız Abonent', 
        items = [] 
    } = payment;

    const utilityType = items[0]?.utilityType || 'gas';

    const getUtilityIcon = () => {
        switch (utilityType) {
            case 'gas':
                return <Flame size={28} className="icon gas" />;
            case 'water':
                return <Droplet size={28} className="icon water" />;
            case 'electricity':
                return <Zap size={28} className="icon electricity" />;
            default:
                return <Flame size={28} className="icon" />;
        }
    };

    const getProviderName = () => {
        switch (utilityType) {
            case 'gas': return 'Azəriqaz';
            case 'water': return 'Azərsu';
            case 'electricity': return 'Azərişıq';
            default: return 'Kommunal';
        }
    };

    return (
        <div className="utility-checkout-container">
            <div className="checkout-back-header">
                <Link to={`/utility/${utilityType}`} className="back-btn">
                    <ArrowLeft size={16} /> Geri Qayıt
                </Link>
            </div>

            <div className="checkout-grid">
                {/* Left Side: Bill info & Details */}
                <div className="checkout-details-section">
                    <div className="checkout-card border-accent">
                        <div className="checkout-provider-header">
                            {getUtilityIcon()}
                            <div>
                                <h3>{getProviderName()} Ödənişi</h3>
                                <p>Provayder Hesabı</p>
                            </div>
                        </div>

                        <div className="abonent-details-list">
                            <div className="detail-row">
                                <span className="label">Abonent Kodu</span>
                                <span className="value">{abonentCode}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Ad Soyad</span>
                                <span className="value">{abonentName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="checkout-card">
                        <h3 className="card-title">Seçilmiş Borclar</h3>
                        <div className="checkout-bills-list">
                            {items.map((item: any, idx: number) => (
                                <div key={idx} className="checkout-bill-item">
                                    <div>
                                        <p className="bill-title capitalize">
                                            {item.utilityType === 'gas' ? 'Qaz Borcu' : item.utilityType === 'water' ? 'Su Borcu' : 'İşıq Borcu'}
                                        </p>
                                        <p className="bill-sub">Dövr: {item.billingMonth}</p>
                                    </div>
                                    <div className="bill-price">
                                        {item.amountPaid.toFixed(2)} AZN
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Wallet details & Pay button */}
                <div className="checkout-payment-section">
                    <div className="payment-summary-card">
                        <h3>Ödəniş Xülasəsi</h3>
                        
                        <div className="summary-row">
                            <span>Borc Məbləği</span>
                            <span>{totalAmount.toFixed(2)} AZN</span>
                        </div>
                        <div className="summary-row">
                            <span>Xidmət haqqı</span>
                            <span className="free-badge">0.00 AZN (Pulsuz)</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total">
                            <span>Toplam Ödəniş</span>
                            <span>{totalAmount.toFixed(2)} AZN</span>
                        </div>

                        {/* Wallet balance display */}
                        <div className="wallet-balance-box">
                            <div className="wallet-info-top">
                                <span className="info-lbl"><Wallet size={16} /> Pul Kisəsi Balansı</span>
                                <span className={`balance-val ${balance < totalAmount ? 'insufficient' : ''}`}>
                                    {balance.toFixed(2)} ₼
                                </span>
                            </div>
                            {balance < totalAmount && (
                                <div className="balance-error-msg">
                                    <AlertCircle size={14} />
                                    <span>Kifayət qədər balans yoxdur. Zəhmət olmasa balansınızı artırın.</span>
                                </div>
                            )}
                        </div>

                        <button 
                            className="checkout-pay-btn"
                            onClick={handleConfirmPayment}
                            disabled={processing || balance < totalAmount}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="spinner-anim" size={18} />
                                    Ödəniş emal edilir...
                                </>
                            ) : (
                                <>
                                    <CreditCard size={18} />
                                    Ödənişi Tamamla ({totalAmount.toFixed(2)} AZN)
                                </>
                            )}
                        </button>

                        <div className="secure-badge">
                            <ShieldCheck size={14} />
                            <span>Discover Karabakh tərəfindən 256-bit SSL ilə qorunur</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
