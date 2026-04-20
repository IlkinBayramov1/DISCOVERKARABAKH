import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Clock, Calendar, Eye } from 'lucide-react';
import { useAttractionAnalytics } from '../../hooks/useAttractionAnalytics';
import './AttractionAnalyticsPage.css';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="tooltip-label">{label}</p>
                <p className="tooltip-value">{`${payload[0].value} baxış`}</p>
            </div>
        );
    }
    return null;
};

export const AttractionAnalyticsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [days, setDays] = useState(90);
    const { data: analytics, loading, error } = useAttractionAnalytics(id!, days);

    if (loading) {
        return (
            <div className="analytics-container loading">
                <div className="spinner">Analitika yüklənir...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-container error">
                <p>Xəta baş verdi: {error}</p>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            <header className="analytics-header">
                <div className="analytics-title">
                    <h1>Məkan Analitikası</h1>
                    <p>Ziyarətçi trendləri və populyarlıq göstəriciləri</p>
                </div>

                <div className="period-filters">
                    {[30, 60, 90].map((period) => (
                        <button
                            key={period}
                            className={`filter-btn ${days === period ? 'active' : ''}`}
                            onClick={() => setDays(period)}
                        >
                            {period} gün
                        </button>
                    ))}
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">
                        <Eye size={18} color="#3b82f6" /> Toplam Baxış
                    </div>
                    <div className="stat-value">{analytics?.totalViews.toLocaleString() || 0}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">
                        <Calendar size={18} color="#8b5cf6" /> Analiz Dövrü
                    </div>
                    <div className="stat-value">{days} gün</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">
                        <TrendingUp size={18} color="#10b981" /> Günlük Orta
                    </div>
                    <div className="stat-value">
                        {analytics ? Math.round(analytics.totalViews / days) : 0}
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card main-chart">
                    <h3>Saatlıq Aktivlik Paylanması</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.hourlyDistribution || []}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="hour"
                                    stroke="#94a3b8"
                                    tickFormatter={(hour) => `${hour}:00`}
                                />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Günlük Baxış Trendi</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics?.dailyDistribution || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="day"
                                    stroke="#94a3b8"
                                    tickFormatter={(str) => str.split('-').slice(1).join('/')}
                                />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="count"
                                    fill="#8b5cf6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Aktivlik İntensivliyi</h3>
                    <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Clock size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
                            <p style={{ color: '#94a3b8' }}>
                                Məkanınız ən çox saat <strong>14:00 - 18:00</strong> arası ziyarət edilir.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttractionAnalyticsPage;
