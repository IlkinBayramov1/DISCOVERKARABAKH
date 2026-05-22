import { useState, useEffect } from 'react';
import { Users, Search, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { utilityApi, type SubscriberItem } from '../api/utility.api';
import './Utility.css';

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
        if (expandedAbonentCode === abonentCode) {
            setExpandedAbonentCode(null);
        } else {
            setExpandedAbonentCode(abonentCode);
        }
    };

    if (loading) {
        return (
            <div className="utility-container">
                <div className="utility-header">
                    <div>
                        <div className="utility-skeleton utility-skeleton-title"></div>
                        <div className="utility-skeleton utility-skeleton-text" style={{ width: '250px' }}></div>
                    </div>
                </div>
                <div className="utility-panel">
                    <div className="utility-skeleton" style={{ width: '100%', height: '40px', marginBottom: '20px', borderRadius: '10px' }}></div>
                    {[1, 2, 3].map(n => (
                        <div key={n} className="utility-skeleton" style={{ width: '100%', height: '50px', marginBottom: '10px', borderRadius: '6px' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="utility-container">
                <div className="utility-alert utility-alert-danger">
                    <AlertCircle className="utility-alert-icon" size={20} />
                    <div className="utility-alert-content">
                        <h4>Məlumat Yüklənə bilmədi</h4>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="utility-container">
            <div className="utility-header">
                <div>
                    <h1>Qeydiyyatlı Sakinlər və Borclar</h1>
                    <p>Abonentlərin siyahısı, aktiv borclar və ödəniş jurnallarına nəzarət.</p>
                </div>
            </div>

            <div className="utility-panel">
                <div className="flex justify-between items-center mb-4">
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Users size={20} className="text-sky-400" />
                        Sakin Siyahısı ({filteredSubscribers.length} abonent)
                    </h3>
                </div>

                {/* Search Bar */}
                <div className="utility-search-bar">
                    <input 
                        type="text" 
                        className="utility-input" 
                        placeholder="Abonent kodu və ya sakin adına görə axtarış..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="utility-btn utility-btn-primary" style={{ padding: '10px 16px' }}>
                        <Search size={18} />
                    </button>
                </div>

                {filteredSubscribers.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center', padding: '30px 0', fontSize: '14px' }}>Axtarışa uyğun heç bir abonent tapılmadı.</p>
                ) : (
                    <div className="utility-table-wrapper">
                        <table className="utility-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}></th>
                                    <th>Abonent Kodu</th>
                                    <th>Sakin Ad Soyad</th>
                                    <th>Aktiv Borc Sayı</th>
                                    <th>Qalıq Məbləğ</th>
                                    <th style={{ textAlign: 'right' }}>Tarixçə</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubscribers.map((sub) => {
                                    const activeBills = sub.utilitybill.filter(b => b.status !== 'paid');
                                    const totalDebt = activeBills.reduce((acc, b) => acc + (b.amount - b.paidAmount), 0);
                                    const isExpanded = expandedAbonentCode === sub.abonentCode;

                                    return (
                                        <>
                                            <tr 
                                                key={sub.id} 
                                                className="cursor-pointer hover:bg-slate-800/50"
                                                onClick={() => toggleExpand(sub.abonentCode)}
                                            >
                                                <td>
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </td>
                                                <td style={{ fontWeight: 600, color: '#38bdf8' }}>{sub.abonentCode}</td>
                                                <td>{sub.residentName}</td>
                                                <td>{activeBills.length} ədəd borc</td>
                                                <td style={{ fontWeight: 700, color: totalDebt > 0 ? '#ef4444' : '#10b981' }}>
                                                    {totalDebt > 0 ? `${totalDebt.toFixed(2)} AZN` : 'Borcu Yoxdur'}
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button 
                                                        className="utility-btn utility-btn-secondary"
                                                        style={{ padding: '4px 10px', fontSize: '12px' }}
                                                    >
                                                        Detalları Göstər
                                                    </button>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={6} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '20px' }}>
                                                        <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>
                                                            {sub.residentName} - Hesablanmış Borc Tarixçəsi
                                                        </h4>
                                                        {sub.utilitybill.length === 0 ? (
                                                            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Bu abonent üzrə heç bir borc qeydi yoxdur.</p>
                                                        ) : (
                                                            <div className="utility-table-wrapper" style={{ border: '1px solid rgba(255,255,255,0.03)' }}>
                                                                <table className="utility-table" style={{ fontSize: '13px' }}>
                                                                    <thead>
                                                                        <tr style={{ background: 'rgba(30,41,59,0.8)' }}>
                                                                            <th>Dövriyyə Ayı</th>
                                                                            <th>Borc Məbləği</th>
                                                                            <th>Ödənilən Məbləğ</th>
                                                                            <th>Qalıq Borc</th>
                                                                            <th>Son Tarix</th>
                                                                            <th>Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {sub.utilitybill.map((bill) => {
                                                                            const remaining = bill.amount - bill.paidAmount;
                                                                            let badgeClass = 'utility-badge-unpaid';
                                                                            let badgeText = 'Ödənilməyib';

                                                                            if (bill.status === 'paid') {
                                                                                badgeClass = 'utility-badge-paid';
                                                                                badgeText = 'Ödənilib';
                                                                            } else if (bill.status === 'partially_paid') {
                                                                                badgeClass = 'utility-badge-partial';
                                                                                badgeText = 'Qismən Ödənilib';
                                                                            }

                                                                            return (
                                                                                <tr key={bill.id}>
                                                                                    <td>{bill.billingMonth}</td>
                                                                                    <td style={{ fontWeight: 600 }}>{bill.amount} AZN</td>
                                                                                    <td style={{ color: '#10b981' }}>{bill.paidAmount} AZN</td>
                                                                                    <td style={{ fontWeight: 600, color: remaining > 0 ? '#ef4444' : '#10b981' }}>{remaining} AZN</td>
                                                                                    <td>{new Date(bill.dueDate).toLocaleDateString('az-AZ')}</td>
                                                                                    <td>
                                                                                        <span className={`utility-badge ${badgeClass}`}>{badgeText}</span>
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </>
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
