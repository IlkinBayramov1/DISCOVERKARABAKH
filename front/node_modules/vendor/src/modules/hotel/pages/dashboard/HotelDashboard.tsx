import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
    Plus,
    Building2,
    MapPin,
    Star,
    BedDouble,
    PencilLine,
    Trash2,
    Image as ImageIcon,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    X,
    Hotel,
    ArrowUpRight,
    Calendar,
    Activity,
    RefreshCw
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
import type { IHotel } from '../../types';
import './HotelDashboard.css';

// Reusable Image Slider Component for the cards
const ImageSlider = ({ images, name }: { images: any[], name: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="no-image-placeholder">
                <ImageIcon size={32} />
            </div>
        );
    }

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
    };

    const currentImage = images[currentIndex].url || images[currentIndex];

    return (
        <div className="hotel-image-slider">
            <img src={currentImage} alt={`${name} - ${currentIndex + 1}`} />
            {images.length > 1 && (
                <>
                    <button className="slider-btn prev" onClick={handlePrevious}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="slider-btn next" onClick={handleNext}>
                        <ChevronRight size={20} />
                    </button>
                    <div className="slider-dots">
                        {images.map((_, idx) => (
                            <span key={idx} className={`dot ${idx === currentIndex ? 'active' : ''}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};


export default function HotelDashboard() {
    const { data: hotelsData, loading: hotelsLoading, error: hotelsError, removeHotel } = useHotels(true);
    const hotels = hotelsData || [];
    const { data: analytics, loading: analyticsLoading } = useAnalytics();
    const navigate = useNavigate();

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
            try {
                await removeHotel(id);
            } catch (err) {
                alert('Failed to delete property.');
            }
        }
    };

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
                <div className="header-actions">
                    <Link to="/hotel/create" className="btn-primary flex items-center gap-2">
                        <Plus size={20} /> New Property
                    </Link>
                </div>
            </div>

            {hotelsError && <div className="alert error">{hotelsError}</div>}

            {/* ANALYTICS SECTION */}
            {hotels.length > 0 && !isLoading && (
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
                            <div className="kpi-icon"><Hotel size={24} /></div>
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

            {/* PROPERTY MANAGEMENT SECTION */}
            <div className="property-management-section mt-5">
                <div className="section-heading mb-4">
                    <h2><Building2 size={24} /> Your Properties</h2>
                    <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {hotels.length} TOTAL
                    </span>
                </div>

                {isLoading ? (
                    <div className="loading-state centered">
                        <RefreshCw className="spin text-blue-500" size={40} />
                        <p className="mt-4 font-semibold text-slate-500">Optimizing dashboard...</p>
                    </div>
                ) : hotels.length === 0 ? (
                    <div className="empty-state glassmorphism-card p-5 text-center">
                        <Hotel size={64} className="text-slate-200 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold">No Listings Found</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                            Start creating your professional property profile to reach global travelers.
                        </p>
                        <Link to="/hotel/create" className="btn-primary">
                            List Your First Property
                        </Link>
                    </div>
                ) : (
                    <div className="hotel-grid">
                        {hotels.map((hotel: IHotel) => (
                            <div key={hotel.id} className="hotel-card relative group">
                                <div className="hotel-card-header">
                                    <span className={`status-badge ${hotel.status}`}>{hotel.status}</span>
                                    {hotel.isFeatured && <span className="featured-badge bg-amber-400 text-amber-900"><Star size={12} /> FEATURED</span>}
                                </div>

                                <ImageSlider images={hotel.images || []} name={hotel.name} />

                                <div className="hotel-card-body">
                                    <div className="title-row">
                                        <h3>{hotel.name}</h3>
                                        <div className="review-summary">
                                            <Star size={14} fill="currentColor" />
                                            <span>{hotel.rating ? hotel.rating.toFixed(1) : 'NEW'}</span>
                                        </div>
                                    </div>

                                    <div className="hotel-info">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span className="truncate">{hotel.city}, {hotel.address}</span>
                                    </div>

                                    <div className="hotel-info">
                                        <BedDouble size={16} className="text-slate-400" />
                                        <span className="capitalize">{hotel.propertyType}</span>
                                    </div>

                                    <div className="card-actions">
                                        <button
                                            className="btn-secondary"
                                            onClick={() => navigate(`/rooms?hotelId=${hotel.id}`)}
                                        >
                                            <BedDouble size={16} /> Manage
                                        </button>
                                        <button
                                            className="btn-secondary outline"
                                            onClick={() => navigate(`/hotel/edit/${hotel.id}`)}
                                        >
                                            <PencilLine size={16} /> Edit
                                        </button>
                                        <button
                                            className="btn-delete-prop"
                                            onClick={() => handleDelete(hotel.id, hotel.name)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
