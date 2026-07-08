import { useEffect, useState } from 'react';
import { Coins, AlertCircle, TrendingUp, CalendarCheck, Wallet, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { utilityApi, type AnalyticsResponse } from '../api/utility.api';
import './UtilityDashboard.css';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="dk-custom-tooltip">
                <p className="tooltip-label">{label}</p>
                <div className="tooltip-data">
                    <span className="dot" style={{ background: '#10b981' }}></span>
                    <p className="tooltip-value">{`${payload[0].value.toLocaleString()} AZN`}</p>
                </div>
            </div>
        );
    }
    return null;
};

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
            <div className="dk-ud-wrapper">
                <div className="dk-util-loading-layout">
                    <div className="spin-loader"></div>
                    <p>Dashboard məlumatları emal edilir...</p>
                </div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="dk-ud-wrapper">
                <div className="dk-util-error-layout">
                    <div className="error-card">
                        <div className="error-icon"><AlertCircle size={32} /></div>
                        <h2>Xəta baş verdi</h2>
                        <p>{error || 'İdarəetmə panelinə daxil olmaq mümkün olmadı.'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const { summary, dailyChart } = analytics;

    return (
        <div className="dk-ud-wrapper">
            <div className="dk-util-container">
                <header className="dk-util-header">
                    <div className="header-main-row">
                        <div className="header-title">
                            <div>
                                <h1>Kommunal İdarəetmə Paneli</h1>
                                <p>Maliyyə axınları, yığım faizi və son tranzaksiyaların real vaxt analitikası.</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="dk-util-stats-grid">
                    <div className="dk-stat-card">
                        <div className="stat-icon-wrap blue"><Coins size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Ümumi Hesablanmış</span>
                            <span className="stat-value"><span className="currency-symbol">₼</span>{summary.totalBilled.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="dk-stat-card">
                        <div className="stat-icon-wrap emerald"><TrendingUp size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Ödənilən Borclar</span>
                            <span className="stat-value"><span className="currency-symbol">₼</span>{summary.totalPaid.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="dk-stat-card">
                        <div className="stat-icon-wrap orange"><Wallet size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Qalıq Borc Məbləği</span>
                            <span className="stat-value"><span className="currency-symbol">₼</span>{summary.totalRemaining.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="dk-stat-card">
                        <div className="stat-icon-wrap red"><AlertTriangle size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Vaxtı Keçmiş Abonent</span>
                            <span className="stat-value">{summary.overdueCount}</span>
                        </div>
                    </div>
                </div>

                <div className="dk-util-charts-grid">
                    <div className="dk-chart-card main-chart">
                        <div className="chart-header">
                            <h3><TrendingUp size={20} color="#10b981" /> Son 7 Günlük Ödəniş Trendi</h3>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickFormatter={(str) => str.split('-').slice(1).join('/')} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '4 4' }} />
                                    <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="dk-chart-card insight-card">
                        <div className="chart-header">
                            <h3><CalendarCheck size={20} color="#0ea5e9" /> Yığım Effektivliyi</h3>
                        </div>
                        <div className="insight-content">
                            <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                                    <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * summary.collectionRate) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
                                </svg>
                                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', lineHeight: '1' }}>{summary.collectionRate}%</span>
                                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.05em' }}>Yığılıb</span>
                                </div>
                            </div>
                        </div>
                        <div className="insight-footer">Ümumi hesaba düşən ödəniş həcminin faiz göstəricisi. Yüksək faiz uğurlu idarəetmə deməkdir.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}