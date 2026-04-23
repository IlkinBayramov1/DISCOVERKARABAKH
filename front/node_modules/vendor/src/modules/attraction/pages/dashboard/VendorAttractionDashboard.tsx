import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Eye, Edit2, Trash2, Heart, Star,
    MapPin, Search, BarChart3, CloudSun, RefreshCw, Ticket
} from 'lucide-react';
import { vendorAttractionApi } from '../../api/attraction.api';
import type { Attraction } from '../../types';
import './VendorAttractionDashboard.css';

const CITIES = ['All Cities', 'Shusha', 'Lachin', 'Khankendi', 'Aghdam', 'Kalbajar'];
const STATUSES = ['All Statuses', 'active', 'closed', 'maintenance'];

export default function VendorAttractionDashboard() {
    const navigate = useNavigate();
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingsCount, setBookingsCount] = useState(0);

    // Filters State
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('All Cities');
    const [status, setStatus] = useState('All Statuses');

    // Weather Cache (City -> Temp)
    const [weatherCache, setWeatherCache] = useState<Record<string, number>>({});

    const loadAttractions = useCallback(async () => {
        try {
            setIsLoading(true);
            const params: any = {};
            if (search) params.keyword = search;
            if (city !== 'All Cities') params.city = city;
            if (status !== 'All Statuses') params.status = status;

            const res = await vendorAttractionApi.getAttractions(params);
            setAttractions(res.data || []);

            // Also load bookings count
            const bookingsRes = await vendorAttractionApi.getBookings();
            setBookingsCount(bookingsRes.data?.length || 0);
        } catch (error) {
            console.error('Failed to load attractions:', error);
        } finally {
            setIsLoading(false);
        }
    }, [search, city, status]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadAttractions();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [loadAttractions]);

    // Load Weather for unique cities
    useEffect(() => {
        const fetchWeatherForCities = async () => {
            const uniqueCities = [...new Set(attractions.map(a => a.city))];
            for (const c of uniqueCities) {
                if (c && !weatherCache[c]) {
                    try {
                        const w = await vendorAttractionApi.getWeather(c);
                        if (w.data?.main?.temp !== undefined) {
                            setWeatherCache(prev => ({ ...prev, [c]: Math.round(w.data.main.temp) }));
                        }
                    } catch (e) {
                        // Silent fail for weather
                    }
                }
            }
        };
        if (attractions.length > 0) fetchWeatherForCities();
    }, [attractions]);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`"${name}" adlı məkanı silməyə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`)) return;
        try {
            await vendorAttractionApi.deleteAttraction(id);
            setAttractions(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            alert('Silmək mümkün olmadı.');
        }
    };

    // Aggregate Stats
    const totalViews = attractions.reduce((sum, a) => sum + (a.stats?.viewCount || 0), 0);
    const totalFavorites = attractions.reduce((sum, a) => sum + (a.stats?.favoriteCount || 0), 0);
    const avgRating = attractions.length
        ? attractions.reduce((sum, a) => sum + (a.stats?.averageRating || 0), 0) / attractions.length
        : 0;

    const getFullImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:4004';
        return `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;
    };

    return (
        <div className="dk-attr-layout">
            <div className="dk-attr-container">

                {/* HEADER */}
                <header className="dk-attr-header">
                    <div className="header-text">
                        <h1 className="dk-title">Məkanların İdarəedilməsi</h1>
                        <p className="dk-subtitle">Məkanlarınızı izləyin, statistikaya baxın və məlumatları yeniləyin.</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="dk-btn-ghost"
                            onClick={() => navigate('/vendor/attractions/bookings')}
                            style={{ marginRight: '1rem' }}
                        >
                            <Ticket size={18} /> Rezervasiyalar
                        </button>
                        <button
                            className="dk-btn-primary"
                            onClick={() => navigate('/vendor/attractions/create')}
                        >
                            <Plus size={18} /> Yeni Məkan
                        </button>
                    </div>
                </header>

                {/* KPI STATS */}
                <div className="dk-attr-stats-grid">
                    <div className="dk-stat-card">
                        <div className="stat-icon-wrap emerald"><Eye size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Toplam Baxış</span>
                            <span className="stat-value">{totalViews.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="dk-stat-card">
                        <div className="stat-icon-wrap rose"><Heart size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Sevimlilər</span>
                            <span className="stat-value">{totalFavorites.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="dk-stat-card">
                        <div className="stat-icon-wrap amber"><Star size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Orta Reytinq</span>
                            <span className="stat-value">{avgRating.toFixed(1)} / 5.0</span>
                        </div>
                    </div>
                    <div className="dk-stat-card">
                        <div className="stat-icon-wrap blue"><MapPin size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Aktiv Elanlar</span>
                            <span className="stat-value">{attractions.length}</span>
                        </div>
                    </div>
                    <div className="dk-stat-card cursor-pointer" onClick={() => navigate('/vendor/attractions/bookings')}>
                        <div className="stat-icon-wrap indigo"><Ticket size={22} /></div>
                        <div className="stat-info">
                            <span className="stat-label">Toplam Rezervasiya</span>
                            <span className="stat-value">{bookingsCount}</span>
                        </div>
                    </div>
                </div>

                {/* FILTERS TOOLBAR */}
                <div className="dk-attr-toolbar">
                    <div className="dk-search-wrap">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Ad və ya açar sözlə axtarın..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="dk-input-search"
                        />
                    </div>
                    <div className="dk-filters-group">
                        <select className="dk-select-filter" value={city} onChange={(e) => setCity(e.target.value)}>
                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select className="dk-select-filter" value={status} onChange={(e) => setStatus(e.target.value)}>
                            {STATUSES.map(s => <option key={s} value={s}>{s === 'All Statuses' ? 'Bütün Statuslar' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                    </div>
                </div>

                {/* LISTINGS SECTION */}
                <div className="dk-attr-content">
                    {isLoading ? (
                        <div className="dk-attr-loading">
                            <RefreshCw size={40} className="spin-icon" />
                            <p>Məkanlar sinxronizasiya olunur...</p>
                        </div>
                    ) : attractions.length === 0 ? (
                        <div className="dk-attr-empty">
                            <div className="empty-icon-circle">
                                <MapPin size={40} />
                            </div>
                            <h3>Heç bir məkan tapılmadı</h3>
                            <p>Axtarış kriteriyalarınızı dəyişin və ya portfelinizə yeni məkan əlavə edin.</p>
                            <button className="dk-btn-ghost mt-4" onClick={() => { setSearch(''); setCity('All Cities'); setStatus('All Statuses'); }}>
                                Filtrləri Sıfırla
                            </button>
                        </div>
                    ) : (
                        <div className="dk-attr-grid">
                            {attractions.map(attraction => {
                                const cover = attraction.images?.find(i => i.isCover)?.url || attraction.images?.[0]?.url;
                                const temp = weatherCache[attraction.city];

                                return (
                                    <div key={attraction.id} className="dk-attr-card">

                                        {/* Image Header */}
                                        <div className="dk-card-media">
                                            {cover ? (
                                                <img
                                                    src={getFullImageUrl(cover)}
                                                    alt={attraction.name}
                                                    className="attr-img"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=DK+Preview';
                                                    }}
                                                />
                                            ) : (
                                                <div className="attr-no-img">
                                                    <MapPin size={32} className="text-slate-300" />
                                                </div>
                                            )}

                                            <div className="card-badges-top">
                                                <span className={`dk-status-badge ${attraction.status}`}>
                                                    {attraction.status}
                                                </span>
                                            </div>

                                            {temp !== undefined && (
                                                <div className="dk-weather-badge">
                                                    <CloudSun size={14} />
                                                    <span>{temp}°C</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Body */}
                                        <div className="dk-card-body">
                                            <h3 className="attr-title" title={attraction.name}>{attraction.name}</h3>

                                            <div className="attr-location">
                                                <MapPin size={14} className="text-blue-500" />
                                                <span>{attraction.city}{attraction.address ? ` - ${attraction.address}` : ''}</span>
                                            </div>

                                            <div className="dk-metrics-row">
                                                <div className="dk-metric-pill amber">
                                                    <Star size={12} />
                                                    {attraction.stats?.averageRating?.toFixed(1) || '0.0'}
                                                </div>
                                                <div className="dk-metric-pill emerald">
                                                    <Eye size={12} />
                                                    {attraction.stats?.viewCount || 0}
                                                </div>
                                                <div className="dk-metric-pill rose">
                                                    <Heart size={12} />
                                                    {attraction.stats?.favoriteCount || 0}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer Actions */}
                                        <div className="dk-card-footer">
                                            <button
                                                className="dk-btn-manage outline"
                                                onClick={() => navigate(`/attractions/edit/${attraction.id}`)}
                                            >
                                                <Edit2 size={16} /> Redaktə
                                            </button>

                                            <div className="footer-actions-right">
                                                <button
                                                    className="dk-icon-btn primary"
                                                    onClick={() => navigate(`/attractions/analytics/${attraction.id}`)}
                                                    title="Analitika"
                                                >
                                                    <BarChart3 size={16} />
                                                </button>
                                                <button
                                                    className="dk-icon-btn danger"
                                                    onClick={() => handleDelete(attraction.id, attraction.name)}
                                                    title="Məkanı Sil"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}