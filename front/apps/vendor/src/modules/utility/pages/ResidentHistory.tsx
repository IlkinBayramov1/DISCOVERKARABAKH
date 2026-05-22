import { useState, useEffect, useMemo, Fragment } from 'react';
import { 
    Users, Search, ChevronDown, ChevronUp, AlertCircle, RefreshCw, 
    SearchX, DollarSign, FileText, CheckCircle
} from 'lucide-react';
import { utilityApi, type SubscriberItem } from '../api/utility.api';
import './ResidentHistory.css';

export default function ResidentHistory() {
    const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
    const [filteredSubscribers, setFilteredSubscribers] = useState<SubscriberItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedAbonentCode, setExpandedAbonentCode] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                setLoading(true);
                const response = await utilityApi.getSubscribers();
                setSubscribers(response.data);
                setFilteredSubscribers(response.data);
            } catch (err: any) {
                setError(err.message || 'Sakin məlumatları gətirilərkən xəta baş verdi.');
            } finally {
                setLoading(false);
            }
        };
        fetchSubscribers();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) {
            setFilteredSubscribers(subscribers);
        } else {
            const filtered = subscribers.filter(sub => 
                sub.abonentCode.toLowerCase().includes(query) ||
                sub.residentName.toLowerCase().includes(query)
            );
            setFilteredSubscribers(filtered);
        }
    }, [searchQuery, subscribers]);

    const toggleExpand = (abonentCode: string) => {
        setExpandedAbonentCode(prev => prev === abonentCode ? null : abonentCode);
    };

    const stats = useMemo(() => {
        let totalDebt = 0, totalPaid = 0, activeBillsCount = 0;
        subscribers.forEach(sub => {
            sub.utilitybill.forEach(bill => {
                totalPaid += bill.paidAmount;
                const remaining = bill.amount - bill.paidAmount;
                if (remaining > 0) {
                    totalDebt += remaining;
                    if (bill.status !== 'paid') activeBillsCount++;
                }
            });
        });
        return { totalSubscribers: subscribers.length, totalDebt, totalPaid, activeBillsCount };
    }, [subscribers]);

    return (
        <div className="dk-rh-wrapper">
            <header className="dk-util-header">
                <div>
                    <h1 className="dk-util-title">Qeydiyyatlı Sakinlər və Borclar</h1>
                    <p className="dk-util-subtitle">Abonentlərin siyahısı, aktiv borclar və ödəniş jurnallarına nəzarət.</p>
                </div>
            </header>

            <div className="dk-util-stats-grid">
                <div className="dk-util-stat-card">
                    <div className="stat-icon-wrap blue"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Ümumi Abonent</span>
                        <h2 className="stat-value">{stats.totalSubscribers}</h2>
                    </div>
                </div>
                <div className="dk-util-stat-card">
                    <div className="stat-icon-wrap red"><DollarSign size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Gözlənilən Qalıq Borc</span>
                        <h2 className="stat-value"><span className="currency">₼</span>{stats.totalDebt.toFixed(2)}</h2>
                    </div>
                </div>
                <div className="dk-util-stat-card">
                    <div className="stat-icon-wrap green"><CheckCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Ümumi Yığımlar</span>
                        <h2 className="stat-value"><span className="currency">₼</span>{stats.totalPaid.toFixed(2)}</h2>
                    </div>
                </div>
                <div className="dk-util-stat-card">
                    <div className="stat-icon-wrap orange"><FileText size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Aktiv Qəbzlər</span>
                        <h2 className="stat-value">{stats.activeBillsCount}</h2>
                    </div>
                </div>
            </div>

            <div className="dk-util-toolbar">
                <div className="dk-util-search">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Abonent kodu və ya sakin adına görə axtarış..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="dk-util-error-alert"><AlertCircle size={20} /><span>{error}</span></div>}

            <div className="dk-util-content-card">
                {loading ? (
                    <div className="dk-util-loading">
                        <RefreshCw size={40} className="spin-icon" />
                        <p>Abonent məlumatları yüklənir...</p>
                    </div>
                ) : filteredSubscribers.length === 0 ? (
                    <div className="dk-util-empty">
                        <div className="empty-icon-circle"><SearchX size={40} /></div>
                        <h3>Məlumat Tapılmadı</h3>
                        <p>Axtarışınıza uyğun heç bir abonent və ya borc qeydi mövcud deyil.</p>
                        {searchQuery && <button className="dk-res-btn-ghost mt-4" onClick={() => setSearchQuery('')}>Axtarışı Sıfırla</button>}
                    </div>
                ) : (
                    <div className="dk-util-table-wrapper">
                        <table className="dk-util-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}></th>
                                    <th>Abonent Profili</th>
                                    <th>Aktiv Qəbzlər</th>
                                    <th>Cəmi Qalıq Borc</th>
                                    <th className="text-right">Tarixçə</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubscribers.map((sub) => {
                                    const activeBills = sub.utilitybill.filter(b => b.status !== 'paid');
                                    const totalDebt = activeBills.reduce((acc, b) => acc + (b.amount - b.paidAmount), 0);
                                    const isExpanded = expandedAbonentCode === sub.abonentCode;
                                    const guestInitial = sub.residentName?.[0]?.toUpperCase() || 'A';

                                    return (
                                        <Fragment key={sub.id}>
                                            <tr className="main-row" onClick={() => toggleExpand(sub.abonentCode)}>
                                                <td className="td-expand">{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</td>
                                                <td>
                                                    <div className="td-guest">
                                                        <div className="guest-avatar">{guestInitial}</div>
                                                        <div className="guest-details">
                                                            <span className="guest-id">#{sub.abonentCode}</span>
                                                            <span className="guest-name">{sub.residentName}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><div className="td-capacity"><strong>{activeBills.length} Qəbz</strong></div></td>
                                                <td><span className={`td-price ${totalDebt > 0 ? 'debt' : 'clear'}`}>{totalDebt > 0 ? `${totalDebt.toFixed(2)} AZN` : 'Borc Yoxdur'}</span></td>
                                                <td className="text-right"><button className="dk-res-btn-ghost" style={{ fontSize: '13px', padding: '6px 14px' }}>{isExpanded ? 'Bağla' : 'Göstər'}</button></td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="dk-util-expanded-row">
                                                    <td colSpan={5}>
                                                        <div className="dk-util-expanded-content">
                                                            <h4 className="dk-util-expanded-title"><FileText size={16} />{sub.residentName} - Ödəniş və Borc Jurnalı</h4>
                                                            {sub.utilitybill.length === 0 ? (
                                                                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Bu abonent üzrə heç bir tarixçə tapılmadı.</p>
                                                            ) : (
                                                                <div className="inner-table-wrapper">
                                                                    <table className="inner-table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Hesabat Ayı</th><th>Hesablanıb</th><th>Ödənilib</th><th>Qalıq Məbləğ</th><th>Son Ödəniş Tarixi</th><th>Status</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {sub.utilitybill.map((bill) => {
                                                                                const remaining = bill.amount - bill.paidAmount;
                                                                                const badgeClass = bill.status === 'paid' ? 'success' : bill.status === 'partially_paid' ? 'warning' : 'danger';
                                                                                const badgeText = bill.status === 'paid' ? 'Ödənilib' : bill.status === 'partially_paid' ? 'Qismən Ödənilib' : 'Ödənilməyib';
                                                                                return (
                                                                                    <tr key={bill.id}>
                                                                                        <td>{bill.billingMonth}</td>
                                                                                        <td>{bill.amount.toFixed(2)} ₼</td>
                                                                                        <td style={{ color: '#10b981' }}>{bill.paidAmount.toFixed(2)} ₼</td>
                                                                                        <td style={{ color: remaining > 0 ? '#ef4444' : '#10b981' }}>{remaining.toFixed(2)} ₼</td>
                                                                                        <td>{new Date(bill.dueDate).toLocaleDateString('az-AZ')}</td>
                                                                                        <td><span className={`dk-util-badge ${badgeClass}`}>{badgeText}</span></td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}