import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams, Link } from 'react-router-dom';
import { Search, Flame, Zap, Droplet, CreditCard, AlertTriangle, AlertCircle, Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { utilityApi, type UtilityAbonent, type UtilityBill } from '../api/utility.api';
import './UtilitySearch.css'; // Yeni CSS faylını bura bağlayın

export default function UtilitySearch() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { provider } = useParams<{ provider: string }>();

    const getProviderName = () => {
        switch (provider) {
            case 'gas': return 'Azəriqaz';
            case 'water': return 'Azərsu';
            case 'electricity': return 'Azərişıq';
            default: return 'Kommunal';
        }
    };

    const getHeroImage = () => {
        switch (provider) {
            case 'gas': return 'url("https://media.deloitte.com/is/image/deloitte/us-natural-gas-workforce:Mobile?$Responsive$&fmt=webp&fit=stretch,1&dpr=on,2.625")';
            case 'water': return 'url("https://cdn.mos.cms.futurecdn.net/cg8cNe5GV3DZyAnoK8dtmS.png")';
            case 'electricity': return 'url("https://ca-times.brightspotcdn.com/dims4/default/b0f3e96/2147483647/strip/true/crop/1599x899+0+0/resize/1200x675!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F68%2F39%2Fb7312937aa407e1daa0eb7404147%2Fla-1546296793-txzcs91mho-snap-image")';
            default: return 'url("https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=2000")';
        }
    };

    // Axtarış
    const [abonentCode, setAbonentCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<{ abonent: UtilityAbonent | null; bills: UtilityBill[] } | null>(null);

    // Smart Link (Profilə bağlı abonentlər)
    const [smartLinkAbonents, setSmartLinkAbonents] = useState<UtilityAbonent[]>([]);
    const [loadingSmartLink, setLoadingSmartLink] = useState(false);

    // Səbət və Hissə-hissə ödəniş
    const [selectedBills, setSelectedBills] = useState<{ [billId: string]: boolean }>({});
    const [billAmounts, setBillAmounts] = useState<{ [billId: string]: number }>({});
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchSmartLinkBills();
        }
    }, [isAuthenticated, searchParams]);

    const fetchSmartLinkBills = async () => {
        try {
            setLoadingSmartLink(true);
            const response = await utilityApi.getResidentBills(provider);
            setSmartLinkAbonents(response.data.data);
        } catch (err) {
            console.error('Smart link abonentləri gətirilərkən xəta:', err);
        } finally {
            setLoadingSmartLink(false);
        }
    };

    const handleSearch = async (e?: React.FormEvent, codeToSearch?: string) => {
        if (e) e.preventDefault();
        const code = codeToSearch || abonentCode;
        if (!code.trim()) return;

        try {
            setLoading(true);
            setError(null);
            setSearchResult(null);

            const response = await utilityApi.searchBills(code, provider);
            setSearchResult(response.data.data);

            const initialSelected: { [key: string]: boolean } = {};
            const initialAmounts: { [key: string]: number } = {};

            response.data.data.bills.forEach((bill: any) => {
                const remaining = bill.amount - bill.paidAmount;
                if (remaining > 0) {
                    initialSelected[bill.id] = true;
                    initialAmounts[bill.id] = remaining;
                }
            });

            setSelectedBills(initialSelected);
            setBillAmounts(initialAmounts);
        } catch (err: any) {
            setError(err.message || 'Abonent kodu tapılmadı və ya axtarış limitiniz doldu.');
        } finally {
            setLoading(false);
        }
    };

    const handleAmountChange = (billId: string, value: string, maxAmount: number) => {
        const amount = parseFloat(value);
        if (isNaN(amount) || amount <= 0) {
            setBillAmounts(prev => ({ ...prev, [billId]: 0 }));
            return;
        }
        const finalAmount = amount > maxAmount ? maxAmount : amount;
        setBillAmounts(prev => ({ ...prev, [billId]: finalAmount }));
    };

    const toggleBillSelect = (billId: string) => {
        setSelectedBills(prev => ({ ...prev, [billId]: !prev[billId] }));
    };

    const getUtilityIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'gas': return <Flame size={24} className="us-bill-icon gas" />;
            case 'electricity': return <Zap size={24} className="us-bill-icon electricity" />;
            case 'water': return <Droplet size={24} className="us-bill-icon water" />;
            default: return <CreditCard size={24} className="us-bill-icon" />;
        }
    };

    const totalPaymentAmount = Object.keys(selectedBills)
        .filter(id => selectedBills[id])
        .reduce((sum, id) => sum + (billAmounts[id] || 0), 0);

    const handlePayment = async () => {
        if (!isAuthenticated) {
            setPaymentError('Ödəniş etmək üçün zəhmət olmasa daxil olun və ya qeydiyyatdan keçin.');
            setTimeout(() => navigate('/auth/login'), 2000);
            return;
        }

        const hasCompleteProfile = user?.firstName && user?.lastName && user?.email;
        if (!hasCompleteProfile) {
            setPaymentError('Profiliniz natamamdır! Ödəniş üçün Ad, Soyad və E-poçt doldurulmalıdır.');
            setTimeout(() => navigate('/account/profile'), 3000);
            return;
        }

        const billPayments = Object.keys(selectedBills)
            .filter(id => selectedBills[id] && billAmounts[id] > 0)
            .map(id => ({
                billId: id,
                amountToPay: billAmounts[id]
            }));

        if (billPayments.length === 0) {
            setPaymentError('Zəhmət olmasa ödəniləcək ən azı bir borc seçin.');
            return;
        }

        try {
            setRedirecting(true);
            setPaymentError(null);
            const response = await utilityApi.initiatePayment(billPayments);
            navigate(`/utility-checkout/${response.data.data.paymentId}`);
        } catch (err: any) {
            setPaymentError(err.message || 'Ödəniş başladılarkən xəta baş verdi.');
            setRedirecting(false);
        }
    };

    return (
        <div className="us-page">
            <main className="us-container">
                
                {/* HERO SECTION */}
                <section className="us-hero" style={{ backgroundImage: getHeroImage() }}>
                    <Link to="/utility" className="us-back-link">
                        <ArrowLeft size={16} /> Geri Qayıt
                    </Link>
                    <div className="us-hero-overlay">
                        <h1>{getProviderName()} Ödənişi</h1>
                        <p>Abonent kodunuzu daxil edərək borclarınızı sürətli və etibarlı şəkildə ödəyin.</p>
                    </div>
                </section>

                {/* SEARCH BAR */}
                <form onSubmit={handleSearch} className="us-search-bar">
                    <div className="us-search-item">
                        <Search className="us-search-icon" />
                        <div className="us-search-input-box">
                            <label>ABONENT KODU</label>
                            <input
                                type="text"
                                className="us-search-input-naked"
                                placeholder="Məsələn: AZ10001..."
                                value={abonentCode}
                                onChange={(e) => setAbonentCode(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="us-search-btn" disabled={loading || !abonentCode.trim()}>
                        {loading ? <RefreshCw className="us-spin" size={20} /> : <Search size={20} />}
                        {loading ? 'Axtarılır...' : 'Borcu Yoxla'}
                    </button>
                </form>

                {/* SMART LINKS (Auth Users) */}
                {isAuthenticated && (loadingSmartLink || smartLinkAbonents.length > 0) && (
                    <div className="us-smart-links">
                        <h4><Sparkles size={16} /> Profilinizə Bağlı Kodlar</h4>
                        {loadingSmartLink ? (
                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Kodlar yüklənir...</span>
                        ) : (
                            <div className="us-smart-tags">
                                {smartLinkAbonents.map(ab => (
                                    <div 
                                        key={ab.id} 
                                        className="us-smart-tag"
                                        onClick={() => {
                                            setAbonentCode(ab.abonentCode);
                                            handleSearch(undefined, ab.abonentCode);
                                        }}
                                    >
                                        {ab.abonentCode} <span style={{ opacity: 0.6, fontSize: '12px' }}>({ab.residentName})</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ALERTS */}
                {error && (
                    <div className="us-alert">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {/* RESULTS SECTION */}
                {searchResult && (
                    <div className="us-results-container">
                        <div className="us-results-header">
                            <h2>{searchResult.abonent?.residentName || 'Qeydiyyatsız Abonent'}</h2>
                            <p>
                                KOD: <strong>{searchResult.abonent?.abonentCode || abonentCode}</strong>
                                {searchResult.abonent?.localAddress && ` • Ünvan: ${searchResult.abonent.localAddress}`}
                            </p>
                        </div>

                        {searchResult.bills.length === 0 ? (
                            <div className="us-empty-state">
                                <h3>Borc Tapılmadı</h3>
                                <p>Bu abonent üzrə hazırda heç bir aktiv borc yoxdur.</p>
                            </div>
                        ) : (
                            <div>
                                {searchResult.bills.map((bill) => {
                                    const remaining = bill.amount - bill.paidAmount;
                                    const isSelected = !!selectedBills[bill.id];
                                    const isOverdue = new Date(bill.dueDate) < new Date() && bill.status !== 'paid';

                                    return (
                                        <div key={bill.id} className={`us-bill-card ${isOverdue ? 'overdue' : ''}`}>
                                            <div className="us-bill-info">
                                                {getUtilityIcon(bill.utilityType)}
                                                <div className="us-bill-details">
                                                    <h3>Dövr: {bill.billingMonth}</h3>
                                                    <div className="us-bill-meta">
                                                        <span>Hesablanıb: {bill.amount} AZN</span>
                                                        <span>•</span>
                                                        <span className={isOverdue ? 'overdue-text' : ''}>
                                                            Son tarix: {new Date(bill.dueDate).toLocaleDateString('az-AZ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="us-bill-action">
                                                <div className="us-bill-debt">{remaining.toFixed(2)} AZN</div>
                                                <div className="us-payment-controls">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleBillSelect(bill.id)}
                                                    />
                                                    <div className="us-partial-pay">
                                                        <input
                                                            type="number"
                                                            value={billAmounts[bill.id] !== undefined ? billAmounts[bill.id] : remaining}
                                                            onChange={(e) => handleAmountChange(bill.id, e.target.value, remaining)}
                                                            disabled={!isSelected}
                                                            step="0.01"
                                                        />
                                                        <span>AZN</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {paymentError && (
                                    <div className="us-alert">
                                        <AlertTriangle size={20} />
                                        <span>{paymentError}</span>
                                    </div>
                                )}

                                {/* CART SUMMARY */}
                                <div className="us-cart-summary">
                                    <div className="us-cart-total">
                                        <span>Ödəniləcək Məbləğ</span>
                                        <strong>{totalPaymentAmount.toFixed(2)} AZN</strong>
                                    </div>
                                    <button
                                        className="us-btn-pay"
                                        onClick={handlePayment}
                                        disabled={totalPaymentAmount <= 0 || redirecting}
                                    >
                                        <CreditCard size={20} />
                                        {redirecting ? 'Yönləndirilir...' : 'Kartla Ödə'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}