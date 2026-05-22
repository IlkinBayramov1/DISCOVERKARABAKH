import { useEffect, useState } from 'react';
import { 
    LayoutDashboard, 
    Coins, 
    Users, 
    AlertCircle, 
    TrendingUp, 
    CalendarCheck 
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { utilityApi, type AnalyticsResponse } from '../api/utility.api';
import './Utility.css';

export default function UtilityDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const response = await utilityApi.getAnalytics();
                setAnalytics(response.data);
            } catch (err: any) {
                setError(err.message || 'Məlumatlar gətirilərkən xəta baş verdi.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="utility-container">
                <div className="utility-header">
                    <div>
                        <div className="utility-skeleton utility-skeleton-title"></div>
                        <div className="utility-skeleton utility-skeleton-text" style={{ width: '200px' }}></div>
                    </div>
                </div>
                <div className="utility-stats-grid">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="utility-stat-card" style={{ height: '140px' }}>
                            <div className="utility-skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px', marginBottom: '15px' }}></div>
                            <div className="utility-skeleton" style={{ width: '80px', height: '15px', marginBottom: '10px' }}></div>
                            <div className="utility-skeleton" style={{ width: '120px', height: '24px' }}></div>
                        </div>
                    ))}
                </div>
                <div className="utility-dashboard-body">
                    <div className="utility-panel" style={{ height: '350px' }}>
                        <div className="utility-skeleton" style={{ width: '150px', height: '20px', marginBottom: '30px' }}></div>
                        <div className="utility-skeleton" style={{ width: '100%', height: '220px' }}></div>
                    </div>
                    <div className="utility-panel" style={{ height: '350px' }}>
                        <div className="utility-skeleton" style={{ width: '150px', height: '20px', marginBottom: '30px' }}></div>
                        <div className="utility-skeleton" style={{ width: '100%', height: '220px' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="utility-container">
                <div className="utility-alert utility-alert-danger">
                    <AlertCircle className="utility-alert-icon" size={20} />
                    <div className="utility-alert-content">
                        <h4>Xəta baş verdi</h4>
                        <p>{error || 'İdarəetmə panelinə daxil olmaq mümkün olmadı.'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const { summary, dailyChart } = analytics;

    return (
        <div className="utility-container">
            <div className="utility-header">
                <div>
                    <h1>Kommunal İdarəetmə Paneli</h1>
                    <p>Maliyyə axınları, yığım faizi və son tranzaksiyaların real vaxt analitikası.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="utility-stats-grid">
                <div className="utility-stat-card">
                    <div className="utility-stat-icon-wrapper">
                        <div className="utility-stat-icon">
                            <Coins size={22} />
                        </div>
                        <span className="utility-badge utility-badge-success">Cari Ay</span>
                    </div>
                    <div className="utility-stat-label">Ümumi Hesablanmış</div>
                    <div className="utility-stat-value">{summary.totalBilled.toLocaleString()} AZN</div>
                </div>

                <div className="utility-stat-card">
                    <div className="utility-stat-icon-wrapper">
                        <div className="utility-stat-icon success">
                            <TrendingUp size={22} />
                        </div>
                        <span className="utility-badge utility-badge-success">Yığılan</span>
                    </div>
                    <div className="utility-stat-label">Ödənilən Borclar</div>
                    <div className="utility-stat-value">{summary.totalPaid.toLocaleString()} AZN</div>
                </div>

                <div className="utility-stat-card">
                    <div className="utility-stat-icon-wrapper">
                        <div className="utility-stat-icon warning">
                            <Coins size={22} />
                        </div>
                        <span className="utility-badge utility-badge-partial">Qalıq</span>
                    </div>
                    <div className="utility-stat-label">Qalıq Borc Məbləği</div>
                    <div className="utility-stat-value">{summary.totalRemaining.toLocaleString()} AZN</div>
                </div>

                <div className="utility-stat-card">
                    <div className="utility-stat-icon-wrapper">
                        <div className="utility-stat-icon danger">
                            <AlertCircle size={22} />
                        </div>
                        <span className="utility-badge utility-badge-unpaid">Gecikmiş</span>
                    </div>
                    <div className="utility-stat-label">Vaxtı Keçmiş Borclar</div>
                    <div className="utility-stat-value">{summary.overdueCount} Abonent</div>
                </div>
            </div>

            {/* Analytical Body */}
            <div className="utility-dashboard-body">
                {/* Collection Chart */}
                <div className="utility-panel">
                    <h3>
                        <TrendingUp size={18} className="text-sky-400" />
                        Son 7 Günlük Ödəniş Trendi
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={dailyChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ background: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                />
                                <Area type="monotone" dataKey="amount" name="Ödəniş (AZN)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Yığım faizi */}
                <div className="utility-panel flex flex-col justify-between">
                    <h3>
                        <CalendarCheck size={18} className="text-emerald-400" />
                        Yığım Effektivliyi
                    </h3>
                    <div className="flex flex-col items-center justify-center py-6">
                        <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                            {/* Circular progress bar simulation */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                                <circle 
                                    cx="50" 
                                    cy="50" 
                                    r="40" 
                                    stroke="#10b981" 
                                    strokeWidth="8" 
                                    fill="transparent" 
                                    strokeDasharray="251.2" 
                                    strokeDashoffset={251.2 - (251.2 * summary.collectionRate) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div style={{ position: 'absolute', fontSize: '32px', fontWeight: '800', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span>{summary.collectionRate}%</span>
                                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase', marginTop: '4px' }}>Yığılıb</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-slate-400 text-sm mt-4">
                        Ümumi hesaba düşən ödəniş həcminin faiz göstəricisi.
                    </div>
                </div>
            </div>
        </div>
    );
}
