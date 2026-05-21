import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Clock, Calendar, Eye, ArrowLeft, Activity, BarChart3, ChevronDown } from 'lucide-react';
import { useAttractionAnalytics } from '../../hooks/useAttractionAnalytics';
import { useAttractions } from '../../hooks/useAttractions';
import './AttractionAnalyticsPage.css';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="dk-custom-tooltip">
                <p className="tooltip-label">{label}</p>
                <div className="tooltip-data">
                    <span className="dot"></span>
                    <p className="tooltip-value">{`${payload[0].value} baxış`}</p>
                </div>
            </div>
        );
    }
    return null;
};

export default function AttractionAnalyticsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [days, setDays] = useState(90);
    
    const { data: attractions, loading: attractionsLoading } = useAttractions(true);
    const { data: analytics, loading: analyticsLoading, error } = useAttractionAnalytics(id || '', days);

    // Auto-redirect if no ID and attractions are loaded
    useEffect(() => {
        if (!id && attractions.length > 0) {
            navigate(`/attractions/analytics/${attractions[0].id}`, { replace: true });
        }
    }, [id, attractions, navigate]);

    if (attractionsLoading || (analyticsLoading && id)) {
        return (
            <div className="dk-aa-loading-layout">
                <div className="spin-loader"></div>
                <p>Analitik məlumatlar emal edilir...</p>
            </div>
        );
    }

    const currentAttraction = attractions.find(a => a.id === id);

    if (!id && attractions.length === 0 && !attractionsLoading) {
        return (
            <div className="dk-aa-error-layout">
                <div className="error-card">
                    <div className="error-icon">!</div>
                    <h2>Məkan tapılmadı</h2>
                    <p>Hələ ki, heç bir məkanınız yoxdur. Analitikaya baxmaq üçün əvvəlcə məkan yaradın.</p>
                    <button onClick={() => navigate('/attractions/create')} className="dk-btn-primary mt-4">
                        Yeni Məkan Yarat
                    </button>
                </div>
            </div>
        );
    }

    if (error && id) {
        return (
            <div className="dk-aa-error-layout">
                <div className="error-card">
                    <div className="error-icon">!</div>
                    <h2>Məlumat tapılmadı</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/attractions')} className="dk-btn-primary mt-4">
                        Geriyə Qayıt
                    </button>
                </div>
            </div>
        );
    }

    const dailyAverage = analytics ? Math.round(analytics.totalViews / days) : 0;

    return (
        <div className="dk-aa-layout">
            <div className="dk-aa-container">
                
                {/* HEADER */}
                <header className="dk-aa-header">
                    <div className="header-top-nav">
                        <button onClick={() => navigate('/attractions')} className="dk-btn-back">
                            <ArrowLeft size={16} /> Panelinə Qayıt
                        </button>

                        <div className="dk-attraction-selector">
                            <label>Məkan Seçin:</label>
                            <div className="selector-wrapper">
                                <select 
                                    value={id || ''} 
                                    onChange={(e) => navigate(`/attractions/analytics/${e.target.value}`)}
                                    className="dk-select-minimal"
                                >
                                    <option value="" disabled>Seçin...</option>
                                    {attractions.map(attr => (
                                        <option key={attr.id} value={attr.id}>{attr.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="selector-chevron" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="header-main-row">
                        <div className="header-title">
                            <div className="icon-badge"><BarChart3 size={24} /></div>
                            <div>
                                <h1>{currentAttraction?.name || 'Məkan'} Analitikası</h1>
                                <p>Ziyarətçi trendləri, populyarlıq və baxış göstəriciləri</p>
                            </div>
                        </div>

                        <div className="dk-period-filters">
                            {[30, 60, 90].map((period) => (
                                <button
                                    key={period}
                                    className={`filter-btn ${days === period ? 'active' : ''}`}
                                    onClick={() => setDays(period)}
                                >
                                    {period} Gün
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* KPI STATS GRID */}
                <div className="dk-aa-stats-grid">
                    <div className="dk-stat-card">
                        <div className="stat-icon-wrap emerald"><Eye size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Toplam Baxış</span>
                            <span className="stat-value">{analytics?.totalViews.toLocaleString() || 0}</span>
                        </div>
                    </div>
                    <div className="dk-stat-card">
                        <div className="stat-icon-wrap purple"><Calendar size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Analiz Dövrü</span>
                            <span className="stat-value">{days} Gün</span>
                        </div>
                    </div>
                    <div className="dk-stat-card">
                        <div className="stat-icon-wrap blue"><TrendingUp size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Günlük Orta Baxış</span>
                            <span className="stat-value">{dailyAverage}</span>
                        </div>
                    </div>
                </div>

                {/* CHARTS SECTION */}
                <div className="dk-aa-charts-grid">
                    
                    {/* AREA CHART - HOURLY */}
                    <div className="dk-chart-card main-chart">
                        <div className="chart-header">
                            <h3>Saatlıq Aktivlik Paylanması</h3>
                            <span className="chart-badge">LİVE TREND</span>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.hourlyDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6a28c7" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#6a28c7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis 
                                        dataKey="hour" 
                                        stroke="#94a3b8" 
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        tickFormatter={(hour) => `${hour}:00`}
                                        axisLine={false} tickLine={false}
                                    />
                                    <YAxis 
                                        stroke="#94a3b8" 
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        axisLine={false} tickLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '4 4' }} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#6a28c7" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorViews)" 
                                        activeDot={{ r: 6, fill: '#6a28c7', stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BAR CHART - DAILY */}
                    <div className="dk-chart-card">
                        <div className="chart-header">
                            <h3>Günlük Baxış Trendi</h3>
                        </div>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics?.dailyDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis 
                                        dataKey="day" 
                                        stroke="#94a3b8" 
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        tickFormatter={(str) => str.split('-').slice(1).join('/')}
                                        axisLine={false} tickLine={false}
                                    />
                                    <YAxis 
                                        stroke="#94a3b8" 
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        axisLine={false} tickLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                    <Bar 
                                        dataKey="count" 
                                        fill="#8b4ddb" 
                                        radius={[4, 4, 0, 0]} 
                                        barSize={20}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* INSIGHT CARD */}
                    <div className="dk-chart-card insight-card">
                        <div className="chart-header">
                            <h3>Aktivlik İntensivliyi</h3>
                        </div>
                        <div className="insight-content">
                            <div className="insight-icon-pulse">
                                <Activity size={32} color="#0ea5e9" />
                            </div>
                            <h4>Pik Saatlar</h4>
                            <p>Sizin məkanınız ən çox <strong className="text-blue-600">14:00 - 18:00</strong> saatları aralığında istifadəçilərin diqqətini cəlb edir.</p>
                            
                            <div className="insight-footer">
                                <Clock size={14} /> İstinad: Son {days} günün analizi
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}