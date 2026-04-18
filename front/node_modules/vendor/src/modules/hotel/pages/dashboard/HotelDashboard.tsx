import { useMemo } from 'react';
import {
    TrendingUp,
    X,
    Hotel as HotelIcon,
    ArrowUpRight,
    Calendar,
    Activity
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
import { useHotels } from '../../hooks/useHotels';
import { useAnalytics } from '../../hooks/useAnalytics';
import './HotelDashboard.css';




export default function HotelDashboard() {
    const { loading: hotelsLoading, error: hotelsError } = useHotels(true);
    const { data: analytics, loading: analyticsLoading } = useAnalytics();

    const chartData = useMemo(() => {
        if (!analytics?.trends?.revenue) return [];
        return analytics.trends.revenue.map(stat => ({
            date: new Date(stat.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            revenue: stat.amount
        }));
    }, [analytics]);

    const stats = useMemo(() => {
        if (!analytics?.summary) return { revenue: 0, bookings: 0, cancellations: 0, occupancy: 0 };
        return {
            revenue: analytics.summary.totalRevenue,
            bookings: analytics.summary.bookingCount,
            cancellations: analytics.summary.cancellationCount,
            occupancy: analytics.summary.occupancyRate
        };
    }, [analytics]);

    const isLoading = hotelsLoading || analyticsLoading;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header mb-5">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Strategy Center</h1>
                    <p className="text-slate-500 mt-1">Real-time performance analytics for your property portfolio</p>
                </div>
            </div>

            {hotelsError && <div className="alert error">{hotelsError}</div>}

            {/* ANALYTICS SECTION */}
            {!isLoading && (
                <div className="analytics-module">
                    {/* KPI CARDS */}
                    <div className="kpi-grid">
                        <div className="kpi-card glassmorphism-card revenue">
                            <div className="kpi-icon"><TrendingUp size={24} /></div>
                            <div className="kpi-content">
                                <span className="kpi-label">Revenue</span>
                                <span className="kpi-value">{stats.revenue.toLocaleString()} AZN</span>
                                <div className="kpi-trend trend-up">
                                    <ArrowUpRight size={14} /> <span>+12.4%</span>
                                </div>
                            </div>
                        </div>
                        <div className="kpi-card glassmorphism-card bookings">
                            <div className="kpi-icon"><Calendar size={24} /></div>
                            <div className="kpi-content">
                                <span className="kpi-label">Bookings</span>
                                <span className="kpi-value">{stats.bookings}</span>
                                <div className="kpi-trend trend-up">
                                    <ArrowUpRight size={14} /> <span>+8.2%</span>
                                </div>
                            </div>
                        </div>
                        <div className="kpi-card glassmorphism-card cancellations">
                            <div className="kpi-icon"><X size={24} /></div>
                            <div className="kpi-content">
                                <span className="kpi-label">Cancellations</span>
                                <span className="kpi-value">{stats.cancellations}</span>
                                <div className="kpi-trend trend-down">
                                    <ArrowUpRight size={14} className="rotate-90" /> <span>-3.1%</span>
                                </div>
                            </div>
                        </div>
                        <div className="kpi-card glassmorphism-card occupancy">
                            <div className="kpi-icon"><HotelIcon size={24} /></div>
                            <div className="kpi-content">
                                <span className="kpi-label">Occupancy</span>
                                <span className="kpi-value">{stats.occupancy}%</span>
                                <div className="kpi-trend trend-up">
                                    <ArrowUpRight size={14} /> <span>+5.0%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CHARTS */}
                    <div className="analytics-grid">
                        <div className="chart-container glassmorphism-card">
                            <div className="chart-header">
                                <h2>Revenue Distribution (Last 7 Days)</h2>
                                <div className="chart-legend">
                                    <div className="legend-item"><span className="legend-puck revenue"></span> Gross Revenue</div>
                                </div>
                            </div>
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis 
                                            dataKey="date" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                            dx={-10}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                borderRadius: '16px', 
                                                border: 'none', 
                                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                                background: 'rgba(255, 255, 255, 0.95)',
                                                backdropFilter: 'blur(10px)'
                                            }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke="#3b82f6" 
                                            strokeWidth={4} 
                                            fillOpacity={1} 
                                            fill="url(#colorRevenue)" 
                                            name="Revenue"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="chart-container glassmorphism-card flex flex-col justify-center items-center text-center">
                            <Activity size={48} className="text-blue-500 mb-4 opacity-50" />
                            <h3 className="font-bold text-lg">Daily Pulse</h3>
                            <p className="text-slate-500 text-sm px-4">Daily occupancy trends and arrival monitors are being compiled.</p>
                            <div className="mt-6 w-full px-6">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                                    <span>DAILY GOAL</span>
                                    <span>75%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                .mb-5 { margin-bottom: 3rem; }
                .mt-5 { margin-top: 3rem; }
                .header-actions { display: flex; align-items: center; }
                .centered { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; }
                .legend-puck { width: 12px; height: 12px; border-radius: 4px; display: inline-block; margin-right: 6px; }
                .legend-puck.revenue { background: #3b82f6; }
                .legend-item { display: flex; align-items: center; font-size: 0.8rem; font-weight: 700; color: #64748b; }
                .featured-badge { padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; gap: 4px; }
                .rotate-90 { transform: rotate(90deg); }
                .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            `}</style>
        </div>
    );
}
