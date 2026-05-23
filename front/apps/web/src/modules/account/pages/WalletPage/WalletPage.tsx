import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { authApi } from '../../../auth/api/auth.api';
import {  
    ArrowUpRight, 
    ArrowDownLeft, 
    CreditCard, 
    History, 
    DollarSign,
    PlusCircle,
    MinusCircle,
    User,
    Calendar,
    Lock,
    Building,
    CheckCircle2,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Wallet
} from 'lucide-react';
import './WalletPage.css';

interface Transaction {
    id: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'payment' | 'refund';
    status: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'FAILED';
    description: string | null;
    withdrawalMethod: string | null;
    cardNumber: string | null;
    bankAccount: string | null;
    createdAt: string;
}

export function WalletPage() {
    const { user, refreshUser } = useAuth();
    const balance = (user as any)?.balance ?? 0.0;

    // View tabs: 'overview', 'deposit', 'withdraw'
    const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw'>('overview');
    
    // Statements filter & pagination
    const [txType, setTxType] = useState<'all' | 'in' | 'out'>('all');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingTx, setLoadingTx] = useState(false);

    // Form inputs: Top Up
    const [depositAmount, setDepositAmount] = useState('50');
    const [depositCustomAmount, setDepositCustomAmount] = useState('');
    const [depCardName, setDepCardName] = useState('');
    const [depCardNumber, setDepCardNumber] = useState('');
    const [depCardExpiry, setDepCardExpiry] = useState('');
    const [depCardCvv, setDepCardCvv] = useState('');
    const [submittingDeposit, setSubmittingDeposit] = useState(false);
    const [depositSuccess, setDepositSuccess] = useState(false);

    // Form inputs: Withdrawal
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState<'bank_card' | 'bank_transfer' | 'cash'>('bank_card');
    const [withCardNumber, setWithCardNumber] = useState('');
    const [withCardName, setWithCardName] = useState('');
    const [withBankAccount, setWithBankAccount] = useState('');
    const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
    const [withdrawSuccess, setWithdrawSuccess] = useState(false);

    const fetchTransactions = async () => {
        setLoadingTx(true);
        try {
            const res = await authApi.getWalletTransactions({ page, limit: 6, type: txType });
            if (res.success && res.data) {
                setTransactions(res.data.transactions);
                setTotalPages(res.data.pagination.totalPages || 1);
            }
        } catch (err) {
            console.error('Tranzaksiyaları yükləyərkən xəta:', err);
        } finally {
            setLoadingTx(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, txType]);

    const handleCardNumberChange = (value: string, setter: (val: string) => void) => {
        const cleaned = value.replace(/\D/g, '');
        const matched = cleaned.match(/.{1,4}/g);
        if (matched) {
            setter(matched.slice(0, 4).join(' '));
        } else {
            setter('');
        }
    };

    const handleExpiryChange = (value: string, setter: (val: string) => void) => {
        let cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            const month = cleaned.slice(0, 2);
            const year = cleaned.slice(2, 4);
            const monthNum = parseInt(month, 10);
            if (monthNum > 12) {
                cleaned = '12' + year;
            } else if (monthNum === 0) {
                cleaned = '01' + year;
            }
            setter(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
        } else {
            setter(cleaned);
        }
    };

    const handleDepositSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalAmt = parseFloat(depositCustomAmount || depositAmount);
        if (isNaN(finalAmt) || finalAmt <= 0) {
            alert('Zəhmət olmasa düzgün məbləğ daxil edin.');
            return;
        }

        setSubmittingDeposit(true);
        try {
            await authApi.topupWallet(finalAmt, depCardNumber.replace(/\s/g, ''));
            setDepositSuccess(true);
            await refreshUser();
            fetchTransactions();
            setTimeout(() => {
                setDepositSuccess(false);
                setDepositCustomAmount('');
                setDepCardName('');
                setDepCardNumber('');
                setDepCardExpiry('');
                setDepCardCvv('');
                setActiveTab('overview');
            }, 2000);
        } catch (err: any) {
            alert(err.message || 'Balans artırıla bilmədi.');
        } finally {
            setSubmittingDeposit(false);
        }
    };

    const handleWithdrawSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalAmt = parseFloat(withdrawAmount);
        if (isNaN(finalAmt) || finalAmt <= 0) {
            alert('Zəhmət olmasa düzgün məbləğ daxil edin.');
            return;
        }
        if (finalAmt > balance) {
            alert('Balansınızda kifayət qədər vəsait yoxdur.');
            return;
        }

        setSubmittingWithdraw(true);
        try {
            await authApi.withdrawWallet({
                amount: finalAmt,
                withdrawalMethod: withdrawMethod,
                cardNumber: withdrawMethod === 'bank_card' ? withCardNumber.replace(/\s/g, '') : undefined,
                bankAccount: withdrawMethod === 'bank_transfer' ? withBankAccount : undefined
            });
            setWithdrawSuccess(true);
            await refreshUser();
            fetchTransactions();
            setTimeout(() => {
                setWithdrawSuccess(false);
                setWithdrawAmount('');
                setWithCardNumber('');
                setWithCardName('');
                setWithBankAccount('');
                setActiveTab('overview');
            }, 2000);
        } catch (err: any) {
            alert(err.message || 'Vəsait çıxarılması zamanı xəta baş verdi.');
        } finally {
            setSubmittingWithdraw(false);
        }
    };

    return (
        <div className="dk-wallet-container">
            <div className="dk-wallet-header">
                <div className="header-title-wrapper">
                    <Wallet className="header-icon" size={28} />
                    <h2>Pul Kisəsi</h2>
                </div>
                <p>Maliyyə balansınızı idarə edin, çıxarışlar əldə edin və rahat şəkildə vəsait köçürün.</p>
            </div>

            <div className="dk-wallet-grid">
                {/* LEFT COLUMN */}
                <div className="dk-wallet-left">
                    {/* Hero Balance Card */}
                    <div className="dk-balance-hero">
                        <div className="hero-glow-blob"></div>
                        <div className="balance-info-sec">
                            <span className="balance-label">Mövcud Balansınız</span>
                            <h1 className="balance-value">{balance.toFixed(2)} <span>₼</span></h1>
                        </div>
                        <div className="wallet-quick-actions">
                            <button 
                                className={`dk-action-btn ${activeTab === 'deposit' ? 'active' : ''}`}
                                onClick={() => setActiveTab('deposit')}
                            >
                                <PlusCircle size={18} />
                                Artır
                            </button>
                            <button 
                                className={`dk-action-btn outline ${activeTab === 'withdraw' ? 'active' : ''}`}
                                onClick={() => setActiveTab('withdraw')}
                            >
                                <MinusCircle size={18} />
                                Çıxar
                            </button>
                        </div>
                    </div>

                    {/* DYNAMIC TAB CONTENT */}
                    <div className="dk-dynamic-card">
                        {activeTab === 'overview' && (
                            <div className="fade-in">
                                <div className="card-header-row">
                                    <h3>Qeydiyyatdakı Kartlar</h3>
                                    <span className="pci-badge"><Lock size={12} /> PCI-DSS</span>
                                </div>
                                <div className="linked-cards-list">
                                    <div className="dk-simulated-card">
                                        <div className="card-chip-row">
                                            <div className="visa-chip"></div>
                                            <div className="visa-logo">VISA</div>
                                        </div>
                                        <div className="card-number-display">**** **** **** 4890</div>
                                        <div className="card-footer-info">
                                            <div className="card-block">
                                                <span>Sahibi</span>
                                                <p>{(user as any)?.firstName || 'ISTIFADECI'} {(user as any)?.lastName || ''}</p>
                                            </div>
                                            <div className="card-block text-right">
                                                <span>Müddət</span>
                                                <p>12/29</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'deposit' && (
                            <div className="fade-in">
                                <div className="card-header-row">
                                    <h3>Balansı Artır</h3>
                                    <button className="dk-back-btn" onClick={() => setActiveTab('overview')}>
                                        <ChevronLeft size={16} /> <span className="hide-mobile">Geri</span>
                                    </button>
                                </div>

                                {depositSuccess ? (
                                    <div className="success-state-box">
                                        <CheckCircle2 className="success-pulse" size={48} />
                                        <h4>Uğurlu Əməliyyat!</h4>
                                        <p>Balansınız artırıldı. Cari balans: <strong>{balance.toFixed(2)} ₼</strong></p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleDepositSubmit} className="dk-form">
                                        <div className="amount-grid">
                                            {['10', '20', '50', '100'].map((val) => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    className={`amount-btn ${depositAmount === val && !depositCustomAmount ? 'selected' : ''}`}
                                                    onClick={() => { setDepositAmount(val); setDepositCustomAmount(''); }}
                                                    disabled={submittingDeposit}
                                                >
                                                    {val} ₼
                                                </button>
                                            ))}
                                        </div>

                                        <div className="dk-input-group">
                                            <label>Digər Məbləğ (₼)</label>
                                            <input
                                                type="number"
                                                placeholder="Məbləğ daxil edin..."
                                                value={depositCustomAmount}
                                                onChange={(e) => { setDepositCustomAmount(e.target.value); setDepositAmount(''); }}
                                                min="1"
                                                disabled={submittingDeposit}
                                            />
                                        </div>

                                        <div className="dk-mockup-fields">
                                            <div className="mockup-header"><CreditCard size={16} /> Kart Məlumatları</div>
                                            <div className="dk-input-wrapper">
                                                <User size={16} />
                                                <input type="text" placeholder="Ad və Soyad" value={depCardName} onChange={(e) => setDepCardName(e.target.value.toUpperCase())} required disabled={submittingDeposit} />
                                            </div>
                                            <div className="dk-input-wrapper">
                                                <CreditCard size={16} />
                                                <input type="text" placeholder="Kart nömrəsi (16 rəqəm)" maxLength={19} value={depCardNumber} onChange={(e) => handleCardNumberChange(e.target.value, setDepCardNumber)} required disabled={submittingDeposit} />
                                            </div>
                                            <div className="input-row-half">
                                                <div className="dk-input-wrapper">
                                                    <Calendar size={16} />
                                                    <input type="text" placeholder="AA/İİ" maxLength={5} value={depCardExpiry} onChange={(e) => handleExpiryChange(e.target.value, setDepCardExpiry)} required disabled={submittingDeposit} />
                                                </div>
                                                <div className="dk-input-wrapper">
                                                    <Lock size={16} />
                                                    <input type="password" placeholder="CVV" maxLength={3} value={depCardCvv} onChange={(e) => setDepCardCvv(e.target.value.replace(/\D/g, ''))} required disabled={submittingDeposit} />
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="dk-submit-btn" disabled={submittingDeposit}>
                                            {submittingDeposit ? <><Loader2 className="spin" size={18} /> İcra olunur...</> : `Ödəniş Et: ${depositCustomAmount || depositAmount} ₼`}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {activeTab === 'withdraw' && (
                            <div className="fade-in">
                                <div className="card-header-row">
                                    <h3>Məbləğ Çıxar</h3>
                                    <button className="dk-back-btn" onClick={() => setActiveTab('overview')}>
                                        <ChevronLeft size={16} /> <span className="hide-mobile">Geri</span>
                                    </button>
                                </div>

                                {withdrawSuccess ? (
                                    <div className="success-state-box">
                                        <CheckCircle2 className="success-pulse" size={48} />
                                        <h4>Sorğu Qəbul Edildi!</h4>
                                        <p>Sorğunuz <b>GÖZLƏMƏDƏDİR</b>. Admin təsdiqindən sonra icra olunacaq.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleWithdrawSubmit} className="dk-form">
                                        <div className="method-grid">
                                            <button type="button" className={`method-btn ${withdrawMethod === 'bank_card' ? 'selected' : ''}`} onClick={() => setWithdrawMethod('bank_card')} disabled={submittingWithdraw}>
                                                <CreditCard size={18} /><span>Kart</span>
                                            </button>
                                            <button type="button" className={`method-btn ${withdrawMethod === 'bank_transfer' ? 'selected' : ''}`} onClick={() => setWithdrawMethod('bank_transfer')} disabled={submittingWithdraw}>
                                                <Building size={18} /><span>IBAN</span>
                                            </button>
                                            <button type="button" className={`method-btn ${withdrawMethod === 'cash' ? 'selected' : ''}`} onClick={() => setWithdrawMethod('cash')} disabled={submittingWithdraw}>
                                                <DollarSign size={18} /><span>Nəğd</span>
                                            </button>
                                        </div>

                                        <div className="dk-input-group">
                                            <label>Çıxarılacaq Məbləğ (₼)</label>
                                            <input type="number" placeholder="Məbləğ daxil edin..." value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} min="1" max={balance} required disabled={submittingWithdraw} />
                                            <span className="hint">Maks: {balance.toFixed(2)} ₼</span>
                                        </div>

                                        {withdrawMethod === 'bank_card' && (
                                            <div className="dk-mockup-fields">
                                                <div className="mockup-header"><CreditCard size={16} /> Köçürüləcək Kart</div>
                                                <div className="dk-input-wrapper">
                                                    <User size={16} />
                                                    <input type="text" placeholder="Ad və Soyad" value={withCardName} onChange={(e) => setWithCardName(e.target.value.toUpperCase())} required disabled={submittingWithdraw} />
                                                </div>
                                                <div className="dk-input-wrapper">
                                                    <CreditCard size={16} />
                                                    <input type="text" placeholder="Kart nömrəsi (16 rəqəm)" maxLength={19} value={withCardNumber} onChange={(e) => handleCardNumberChange(e.target.value, setWithCardNumber)} required disabled={submittingWithdraw} />
                                                </div>
                                            </div>
                                        )}

                                        {withdrawMethod === 'bank_transfer' && (
                                            <div className="dk-mockup-fields">
                                                <div className="mockup-header"><Building size={16} /> Bank Transfer (IBAN)</div>
                                                <div className="dk-input-wrapper">
                                                    <Building size={16} />
                                                    <input type="text" placeholder="AZ00000000000000000000000000" value={withBankAccount} onChange={(e) => setWithBankAccount(e.target.value.toUpperCase())} required disabled={submittingWithdraw} />
                                                </div>
                                            </div>
                                        )}

                                        {withdrawMethod === 'cash' && (
                                            <div className="info-box accent">
                                                Təsdiqdən sonra <b>Baku Center</b> ofisimizdən şəxsiyyət vəsiqəsi ilə vəsaiti əldə edə bilərsiniz.
                                            </div>
                                        )}

                                        <button type="submit" className="dk-submit-btn danger" disabled={submittingWithdraw}>
                                            {submittingWithdraw ? <><Loader2 className="spin" size={18} /> İcra olunur...</> : `Çıxarış Sorğusu: ${withdrawAmount || '0'} ₼`}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: HISTORY */}
                <div className="dk-wallet-right">
                    <div className="dk-history-card">
                        <div className="history-header">
                            <h3><History size={18} /> Çıxarışlar</h3>
                            <div className="filter-pills">
                                <button className={txType === 'all' ? 'active' : ''} onClick={() => { setTxType('all'); setPage(1); }}>Hamısı</button>
                                <button className={txType === 'in' ? 'active' : ''} onClick={() => { setTxType('in'); setPage(1); }}>Gələn</button>
                                <button className={txType === 'out' ? 'active' : ''} onClick={() => { setTxType('out'); setPage(1); }}>Gedən</button>
                            </div>
                        </div>

                        {loadingTx ? (
                            <div className="empty-state"><Loader2 className="spin" size={28} /></div>
                        ) : transactions.length === 0 ? (
                            <div className="empty-state">Əməliyyat tapılmadı.</div>
                        ) : (
                            <div className="tx-list">
                                {transactions.map((tx) => {
                                    const isIncome = tx.type === 'deposit' || tx.type === 'refund';
                                    return (
                                        <div key={tx.id} className="tx-item">
                                            <div className="tx-left">
                                                <div className={`tx-icon ${isIncome ? 'inc' : 'exp'}`}>
                                                    {isIncome ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                </div>
                                                <div className="tx-text">
                                                    <span className="tx-title">{tx.description || 'Transfer'}</span>
                                                    <span className="tx-date">{new Date(tx.createdAt).toLocaleDateString('az-AZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            <div className="tx-right">
                                                <span className={`tx-amt ${isIncome ? 'inc' : 'exp'}`}>
                                                    {isIncome ? '+' : '-'}{tx.amount.toFixed(2)} ₼
                                                </span>
                                                <span className={`status-badge ${tx.status.toLowerCase()}`}>
                                                    {tx.status === 'PENDING' ? 'Gözləmədə' : tx.status === 'COMPLETED' ? 'Uğurlu' : 'İmtina'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}><ChevronLeft size={16} /></button>
                                        <span>{page} / {totalPages}</span>
                                        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}><ChevronRight size={16} /></button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}