import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams, Link } from 'react-router-dom';
import { Search, Flame, Zap, Droplet, CreditCard, AlertTriangle, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { utilityApi, type UtilityAbonent, type UtilityBill } from '../api/utility.api';
import './Utility.css';

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
        // Qeydiyyatlı istifadəçidirsə onun abonent kodlarını gətiririk (Smart Link)
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

            // İlkin olaraq bütün borcları seçili edirik və məbləğləri tam borc təyin edirik
            const initialSelected: { [key: string]: boolean } = {};
            const initialAmounts: { [key: string]: number } = {};

            response.data.data.bills.forEach(bill => {
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

        // Borcdan artıq məbləğ ödənməsinin qarşısını alırıq
        const finalAmount = amount > maxAmount ? maxAmount : amount;
        setBillAmounts(prev => ({ ...prev, [billId]: finalAmount }));
    };

    const toggleBillSelect = (billId: string) => {
        setSelectedBills(prev => ({ ...prev, [billId]: !prev[billId] }));
    };

    const getUtilityIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'gas': return <Flame className="text-amber-500" size={18} />;
            case 'electricity': return <Zap className="text-yellow-500" size={18} />;
            case 'water': return <Droplet className="text-sky-500" size={18} />;
            default: return <CreditCard className="text-slate-500" size={18} />;
        }
    };

    // Seçilmiş borcların ümumi cəmi
    const totalPaymentAmount = Object.keys(selectedBills)
        .filter(id => selectedBills[id])
        .reduce((sum, id) => sum + (billAmounts[id] || 0), 0);

    const handlePayment = async () => {
        if (!isAuthenticated) {
            // Qeydiyyatlı olmalıdır
            setPaymentError('Ödəniş etmək üçün zəhmət olmasa əvvəlcə daxil olun və ya qeydiyyatdan keçin.');
            setTimeout(() => navigate('/auth/login'), 2000);
            return;
        }

        // Profil doluluq validasiyası: Ad, Soyad, Email və Telefon vacibdir!
        // Qeyd: back-end tərəfindən də bu yoxlanılır.
        const hasCompleteProfile = user?.firstName && user?.lastName && user?.email;
        if (!hasCompleteProfile) {
            setPaymentError('Profiliniz natamamdır! Ödəniş etmək üçün Ad, Soyad və E-poçt doldurulmalıdır. Profilinizə yönləndirilirsiniz...');
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
            // Daxili təsdiqləmə səhifəsinə yönləndiririk
            navigate(`/utility-confirmation/${response.data.data.paymentId}`);
        } catch (err: any) {
            setPaymentError(err.message || 'Ödəniş başladılarkən xəta baş verdi.');
            setRedirecting(false);
        }
    };

    return (
        <div className="web-utility-page">
            <div className="web-utility-container">
                <div className="web-utility-header">
                    <Link to="/utility" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '20px', fontWeight: 600 }}>
                        <ArrowLeft size={18} />
                        Geri qayıt
                    </Link>
                    <h1>{getProviderName()} Borcunun Ödənilməsi</h1>
                    <p>Abonent kodunuzu daxil edərək borclarınızı sürətli və etibarlı şəkildə ödəyin.</p>
                </div>

                {/* Smart Link / Profilimə Bağlı Kodlar */}
                {isAuthenticated && (loadingSmartLink || smartLinkAbonents.length > 0) && (
                    <div className="web-utility-search-box" style={{ marginBottom: '25px', padding: '20px' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1' }}>
                            <Sparkles size={16} />
                            Profilinizə Bağlı Abonent Kodları
                        </h4>
                        {loadingSmartLink ? (
                            <div style={{ color: '#64748b', fontSize: '14px' }}>Abonent kodları yüklənir...</div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {smartLinkAbonents.map(ab => (
                                    <button
                                        key={ab.id}
                                        className="utility-btn utility-btn-secondary"
                                        style={{ fontSize: '13px', padding: '8px 14px' }}
                                        onClick={() => {
                                            setAbonentCode(ab.abonentCode);
                                            handleSearch(undefined, ab.abonentCode);
                                        }}
                                    >
                                        {ab.abonentCode} ({ab.residentName})
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Search Panel */}
                <div className="web-utility-search-box">
                    <form onSubmit={handleSearch}>
                        <div className="web-search-input-group">
                            <div className="web-search-input-wrapper">
                                <Search className="web-search-icon" size={22} />
                                <input
                                    type="text"
                                    className="web-search-input"
                                    placeholder="Abonent kodunu daxil edin (məs: AZ10001)..."
                                    value={abonentCode}
                                    onChange={(e) => setAbonentCode(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="web-btn-search"
                                disabled={loading || !abonentCode.trim()}
                            >
                                {loading ? 'Axtarılır...' : 'Borcu Yoxla'}
                            </button>
                        </div>
                    </form>
                </div>

                {error && (
                    <div className="web-alert web-alert-danger">
                        <AlertCircle size={20} />
                        <div>{error}</div>
                    </div>
                )}

                {/* Results Screen */}
                {searchResult && (
                    <div className="web-utility-results">
                        <div className="web-results-header">
                            <div className="web-abonent-info">
                                <h2>{searchResult.abonent?.residentName || 'Qeydiyyatsız Abonent'}</h2>
                                <p>
                                    Abonent Kodu: <strong>{searchResult.abonent?.abonentCode || abonentCode}</strong>
                                    {searchResult.abonent?.localAddress && ` | Ünvan: ${searchResult.abonent.localAddress}`}
                                </p>
                            </div>
                        </div>

                        {searchResult.bills.length === 0 ? (
                            <p style={{ color: '#64748b', textAlign: 'center', padding: '20px 0' }}>Bu abonent üzrə heç bir aktiv borc tapılmadı.</p>
                        ) : (
                            <div>
                                {searchResult.bills.map((bill) => {
                                    const remaining = bill.amount - bill.paidAmount;
                                    const isSelected = !!selectedBills[bill.id];
                                    const isOverdue = new Date(bill.dueDate) < new Date() && bill.status !== 'paid';

                                    return (
                                        <div key={bill.id} className={`web-bill-card ${isOverdue ? 'overdue' : ''}`}>
                                            <div className="web-bill-details">
                                                <h3>
                                                    {getUtilityIcon(bill.utilityType)}
                                                    {bill.utilityType === 'gas' ? 'Qaz Borcu' : bill.utilityType === 'electricity' ? 'Elektrik Borcu' : 'Su Borcu'}
                                                </h3>
                                                <div className="web-bill-meta">
                                                    <div className="web-bill-meta-item">Dövr: {bill.billingMonth}</div>
                                                    <div className={`web-bill-meta-item ${isOverdue ? 'text-red' : ''}`}>
                                                        Son tarix: {new Date(bill.dueDate).toLocaleDateString('az-AZ')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="web-bill-action">
                                                <div className="web-bill-amount">{remaining.toFixed(2)} AZN</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <input
                                                        type="checkbox"
                                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                                        checked={isSelected}
                                                        onChange={() => toggleBillSelect(bill.id)}
                                                    />
                                                    <div className="web-pay-input-wrapper">
                                                        <input
                                                            type="number"
                                                            className="web-pay-input"
                                                            value={billAmounts[bill.id] !== undefined ? billAmounts[bill.id] : remaining}
                                                            onChange={(e) => handleAmountChange(bill.id, e.target.value, remaining)}
                                                            disabled={!isSelected}
                                                            step="0.01"
                                                        />
                                                        <span className="web-pay-currency">AZN</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {paymentError && (
                                    <div className="web-alert web-alert-danger" style={{ marginTop: '20px' }}>
                                        <AlertTriangle size={20} />
                                        <div>{paymentError}</div>
                                    </div>
                                )}

                                {/* Cart Summary Footer */}
                                <div className="web-cart-summary">
                                    <div className="web-cart-total">
                                        <span>Ödəniləcək Ümumi Məbləğ:</span>
                                        <strong>{totalPaymentAmount.toFixed(2)} AZN</strong>
                                    </div>
                                    <button
                                        className="web-btn-pay"
                                        onClick={handlePayment}
                                        disabled={totalPaymentAmount <= 0 || redirecting}
                                    >
                                        <CreditCard size={20} />
                                        {redirecting ? 'Ödəniş səhifəsinə yönləndirilir...' : 'Kartla Ödə'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}
