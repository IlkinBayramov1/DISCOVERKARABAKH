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
    ChevronRight
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

    // Fetch transactions list
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

    // Format Card Number (space every 4 digits)
    const handleCardNumberChange = (value: string, setter: (val: string) => void) => {
        const cleaned = value.replace(/\D/g, '');
        const matched = cleaned.match(/.{1,4}/g);
        if (matched) {
            setter(matched.slice(0, 4).join(' '));
        } else {
            setter('');
        }
    };

    // Format Expiry Date (MM/YY)
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
        <div className="wallet-page-container">
            <div className="wallet-page-header">
                <h2>Pul Kisəsi (Wallet)</h2>
                <p>Maliyyə balansınızı idarə edin, çıxarışlar əldə edin və rahat şəkildə vəsait köçürün.</p>
            </div>

            <div className="wallet-grid-main">
                {/* LEFT COLUMN: Overview & Dynamic Form widgets */}
                <div className="wallet-left-col">
                    {/* Visual Card Showcase */}
                    <div className="wallet-balance-hero">
                        <div className="hero-card-pattern"></div>
                        <div className="balance-info-sec">
                            <span className="balance-label">Mövcud Balansınız</span>
                            <h1 className="balance-value">{balance.toFixed(2)} <span>₼</span></h1>
                        </div>
                        <div className="wallet-quick-actions">
                            <button 
                                className={`action-btn btn-deposit ${activeTab === 'deposit' ? 'active' : ''}`}
                                onClick={() => setActiveTab('deposit')}
                            >
                                <PlusCircle size={18} />
                                Balansı Artır
                            </button>
                            <button 
                                className={`action-btn btn-withdraw ${activeTab === 'withdraw' ? 'active' : ''}`}
                                onClick={() => setActiveTab('withdraw')}
                            >
                                <MinusCircle size={18} />
                                Vəsait Çıxar
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Tabs view */}
                    {activeTab === 'overview' && (
                        <div className="wallet-linked-cards-section">
                            <div className="section-title-row">
                                <h3>Qeydiyyatdakı Kartlar</h3>
                                <span className="pci-badge"><Lock size={12} /> PCI-DSS Secure</span>
                            </div>
                            <div className="linked-cards-list">
                                <div className="simulated-visa-card">
                                    <div className="visa-chip"></div>
                                    <div className="visa-logo">VISA</div>
                                    <div className="card-number-display">**** **** **** 4890</div>
                                    <div className="card-footer-info">
                                        <div className="card-holder-name">
                                            <span>Kart Sahibi</span>
                                            <p>{(user as any)?.firstName || 'ISTIFADECI'} {(user as any)?.lastName || ''}</p>
                                        </div>
                                        <div className="card-expiry-val">
                                            <span>Müddət</span>
                                            <p>12/29</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="simulated-card-placeholder">
                                    <p>Gələcəkdə yeni ödəniş şlüzlərini tokenləşdirmək üçün ödəniş sisteminə inteqrasiya nəzərdə tutulur.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'deposit' && (
                        <div className="wallet-form-wrapper">
                            <div className="form-header-row">
                                <h3>Balansı Artır (Top Up)</h3>
                                <button className="back-to-overview-btn" onClick={() => setActiveTab('overview')}>
                                    <ChevronLeft size={16} /> Geri
                                </button>
                            </div>

                            {depositSuccess ? (
                                <div className="form-success-alert">
                                    <CheckCircle2 className="success-icon-anim" size={48} />
                                    <h4>Ödəniş Uğurla İcra Edildi!</h4>
                                    <p>Balansınız artırıldı. Cari balansınız: {balance.toFixed(2)} ₼</p>
                                </div>
                            ) : (
                                <form onSubmit={handleDepositSubmit} className="wallet-action-form">
                                    <div className="amount-selectors-grid">
                                        {['10', '20', '50', '100'].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                className={`amount-sel-btn ${depositAmount === val && !depositCustomAmount ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setDepositAmount(val);
                                                    setDepositCustomAmount('');
                                                }}
                                                disabled={submittingDeposit}
                                            >
                                                {val} ₼
                                            </button>
                                        ))}
                                    </div>

                                    <div className="custom-input-group">
                                        <label>Digər Məbləğ (₼)</label>
                                        <input
                                            type="number"
                                            placeholder="Məbləğ daxil edin..."
                                            value={depositCustomAmount}
                                            onChange={(e) => {
                                                setDepositCustomAmount(e.target.value);
                                                setDepositAmount('');
                                            }}
                                            min="1"
                                            disabled={submittingDeposit}
                                        />
                                    </div>

                                    <div className="card-mockup-fields">
                                        <div className="mockup-header">
                                            <CreditCard size={18} />
                                            <span>Kart Məlumatları</span>
                                        </div>
                                        <div className="mockup-row">
                                            <div className="input-with-icon">
                                                <User size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="Sahibinin Adı Soyadı"
                                                    value={depCardName}
                                                    onChange={(e) => setDepCardName(e.target.value.toUpperCase())}
                                                    required
                                                    disabled={submittingDeposit}
                                                />
                                            </div>
                                        </div>
                                        <div className="mockup-row">
                                            <div className="input-with-icon">
                                                <CreditCard size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="Kart nömrəsi (16 rəqəm)"
                                                    maxLength={19}
                                                    value={depCardNumber}
                                                    onChange={(e) => handleCardNumberChange(e.target.value, setDepCardNumber)}
                                                    required
                                                    disabled={submittingDeposit}
                                                />
                                            </div>
                                        </div>
                                        <div className="mockup-row double-col">
                                            <div className="input-with-icon">
                                                <Calendar size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="AA/İİ (MM/YY)"
                                                    maxLength={5}
                                                    value={depCardExpiry}
                                                    onChange={(e) => handleExpiryChange(e.target.value, setDepCardExpiry)}
                                                    required
                                                    disabled={submittingDeposit}
                                                />
                                            </div>
                                            <div className="input-with-icon">
                                                <Lock size={16} />
                                                <input
                                                    type="password"
                                                    placeholder="CVV"
                                                    maxLength={3}
                                                    value={depCardCvv}
                                                    onChange={(e) => setDepCardCvv(e.target.value.replace(/\D/g, ''))}
                                                    required
                                                    disabled={submittingDeposit}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="form-submit-action-btn"
                                        disabled={submittingDeposit}
                                    >
                                        {submittingDeposit ? (
                                            <>
                                                <Loader2 className="spinner-anim" size={18} />
                                                Tranzaksiya icra olunur...
                                            </>
                                        ) : (
                                            `Ödəniş Et: ${depositCustomAmount || depositAmount} ₼`
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {activeTab === 'withdraw' && (
                        <div className="wallet-form-wrapper">
                            <div className="form-header-row">
                                <h3>Balansı Çıxar (Withdraw)</h3>
                                <button className="back-to-overview-btn" onClick={() => setActiveTab('overview')}>
                                    <ChevronLeft size={16} /> Geri
                                </button>
                            </div>

                            {withdrawSuccess ? (
                                <div className="form-success-alert">
                                    <CheckCircle2 className="success-icon-anim" size={48} />
                                    <h4>Çıxarış Sorğusu Qəbul Edildi!</h4>
                                    <p>Sorğunuz hazırda <b>GÖZLƏMƏDƏDİR (PENDING)</b>. Admin tərəfindən təsdiq edildikdən sonra icra olunacaq.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleWithdrawSubmit} className="wallet-action-form">
                                    <div className="withdrawal-method-selector">
                                        <button
                                            type="button"
                                            className={`method-btn ${withdrawMethod === 'bank_card' ? 'selected' : ''}`}
                                            onClick={() => setWithdrawMethod('bank_card')}
                                            disabled={submittingWithdraw}
                                        >
                                            <CreditCard size={18} />
                                            <span>Bank Kartına</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={`method-btn ${withdrawMethod === 'bank_transfer' ? 'selected' : ''}`}
                                            onClick={() => setWithdrawMethod('bank_transfer')}
                                            disabled={submittingWithdraw}
                                        >
                                            <Building size={18} />
                                            <span>Hesaba (IBAN)</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={`method-btn ${withdrawMethod === 'cash' ? 'selected' : ''}`}
                                            onClick={() => setWithdrawMethod('cash')}
                                            disabled={submittingWithdraw}
                                        >
                                            <DollarSign size={18} />
                                            <span>Nəğd (Ofisdən)</span>
                                        </button>
                                    </div>

                                    <div className="custom-input-group">
                                        <label>Çıxarılacaq Məbləğ (₼)</label>
                                        <input
                                            type="number"
                                            placeholder="Çıxarmaq istədiyiniz məbləğ..."
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            min="1"
                                            max={balance}
                                            required
                                            disabled={submittingWithdraw}
                                        />
                                        <span className="balance-hint">Maksimum çıxara biləcəyiniz: {balance.toFixed(2)} ₼</span>
                                    </div>

                                    {withdrawMethod === 'bank_card' && (
                                        <div className="card-mockup-fields">
                                            <div className="mockup-header">
                                                <CreditCard size={18} />
                                                <span>Köçürüləcək Kart</span>
                                            </div>
                                            <div className="mockup-row">
                                                <div className="input-with-icon">
                                                    <User size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="Sahibinin Adı Soyadı"
                                                        value={withCardName}
                                                        onChange={(e) => setWithCardName(e.target.value.toUpperCase())}
                                                        required
                                                        disabled={submittingWithdraw}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mockup-row">
                                                <div className="input-with-icon">
                                                    <CreditCard size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="Kart nömrəsi (16 rəqəm)"
                                                        maxLength={19}
                                                        value={withCardNumber}
                                                        onChange={(e) => handleCardNumberChange(e.target.value, setWithCardNumber)}
                                                        required
                                                        disabled={submittingWithdraw}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {withdrawMethod === 'bank_transfer' && (
                                        <div className="card-mockup-fields">
                                            <div className="mockup-header">
                                                <Building size={18} />
                                                <span>Bank Transfer Məlumatları</span>
                                            </div>
                                            <div className="mockup-row">
                                                <div className="input-with-icon">
                                                    <Building size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="IBAN / Bank Hesab Nömrəsi"
                                                        value={withBankAccount}
                                                        onChange={(e) => setWithBankAccount(e.target.value.toUpperCase())}
                                                        required
                                                        disabled={submittingWithdraw}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {withdrawMethod === 'cash' && (
                                        <div className="cash-pickup-info">
                                            <p>Vəsait sorğunuz təsdiq edildikdən sonra <b>Baku Center Ofisimizdən</b> şəxsiyyət vəsiqəsi ilə yaxınlaşıb nəğd əldə edə bilərsiniz.</p>
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        className="form-submit-action-btn withdraw-accent"
                                        disabled={submittingWithdraw}
                                    >
                                        {submittingWithdraw ? (
                                            <>
                                                <Loader2 className="spinner-anim" size={18} />
                                                Sorğu göndərilir...
                                            </>
                                        ) : (
                                            `Çıxarış Sorğusu Göndər: ${withdrawAmount || '0'} ₼`
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Statements History */}
                <div className="wallet-right-col">
                    <div className="statements-wrapper-card">
                        <div className="statements-header">
                            <div className="title-area">
                                <History size={20} />
                                <h3>Hesab Çıxarışları</h3>
                            </div>
                            <div className="filter-options-bar">
                                <button 
                                    className={`filter-tab ${txType === 'all' ? 'active' : ''}`}
                                    onClick={() => { setTxType('all'); setPage(1); }}
                                    disabled={loadingTx}
                                >
                                    Hamısı
                                </button>
                                <button 
                                    className={`filter-tab ${txType === 'in' ? 'active' : ''}`}
                                    onClick={() => { setTxType('in'); setPage(1); }}
                                    disabled={loadingTx}
                                >
                                    Gələn
                                </button>
                                <button 
                                    className={`filter-tab ${txType === 'out' ? 'active' : ''}`}
                                    onClick={() => { setTxType('out'); setPage(1); }}
                                    disabled={loadingTx}
                                >
                                    Gedən
                                </button>
                            </div>
                        </div>

                        {loadingTx ? (
                            <div className="statements-loading-state">
                                <Loader2 className="spinner-anim" size={32} />
                                <p>Çıxarışlar yüklənir...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="statements-empty-state">
                                <p>Hər hansı bir əməliyyat tapılmadı.</p>
                            </div>
                        ) : (
                            <div className="transactions-list-grid">
                                {transactions.map((tx) => {
                                    const isDepositOrRefund = tx.type === 'deposit' || tx.type === 'refund';
                                    return (
                                        <div key={tx.id} className="transaction-item-card">
                                            <div className="item-left">
                                                <div className={`tx-icon-holder ${isDepositOrRefund ? 'income' : 'expense'}`}>
                                                    {isDepositOrRefund ? (
                                                        <ArrowDownLeft size={18} />
                                                    ) : (
                                                        <ArrowUpRight size={18} />
                                                    )}
                                                </div>
                                                <div className="tx-details-labels">
                                                    <span className="tx-desc">{tx.description || 'Pul Köçürməsi'}</span>
                                                    <span className="tx-date">{new Date(tx.createdAt).toLocaleDateString('az-AZ', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}</span>
                                                </div>
                                            </div>
                                            <div className="item-right">
                                                <div className={`tx-amount ${isDepositOrRefund ? 'income' : 'expense'}`}>
                                                    {isDepositOrRefund ? '+' : '-'}{tx.amount.toFixed(2)} ₼
                                                </div>
                                                <div className={`tx-status-badge ${tx.status.toLowerCase()}`}>
                                                    {tx.status === 'PENDING' ? 'Gözləmədə' : 
                                                     tx.status === 'COMPLETED' ? 'Uğurlu' : 
                                                     tx.status === 'REJECTED' ? 'İmtina' : 'Uğursuz'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {totalPages > 1 && (
                                    <div className="statements-pagination-row">
                                        <button 
                                            className="pag-nav-btn"
                                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                            disabled={page === 1 || loadingTx}
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <span className="pag-info-label">{page} / {totalPages}</span>
                                        <button 
                                            className="pag-nav-btn"
                                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                            disabled={page === totalPages || loadingTx}
                                        >
                                            <ChevronRight size={16} />
                                        </button>
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
