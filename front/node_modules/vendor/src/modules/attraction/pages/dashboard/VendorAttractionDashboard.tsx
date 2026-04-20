import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Eye, Edit2, Trash2, Heart, Star, 
    MapPin, Search, BarChart3, CloudSun 
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

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu məkanı silməyə əminsiniz?')) return;
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
        <div className="attraction-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Məkanların İdarəedilməsi</h1>
                    <p>Məkanlarınızı izləyin, statistikaya baxın və məlumatları yeniləyin</p>
                </div>
                <button 
                    className="btn-create" 
                    onClick={() => navigate('/vendor/attractions/create')}
                >
                    <Plus size={20} />
                    Yeni Məkan
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon views"><Eye size={24} /></div>
                    <div className="stat-info">
                        <h3>Toplam Baxış</h3>
                        <p>{totalViews.toLocaleString()}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon favorites"><Heart size={24} /></div>
                    <div className="stat-info">
                        <h3>Sevimlilər</h3>
                        <p>{totalFavorites.toLocaleString()}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon rating"><Star size={24} /></div>
                    <div className="stat-info">
                        <h3>Orta Reytinq</h3>
                        <p>{avgRating.toFixed(1)} / 5.0</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon listings"><MapPin size={24} /></div>
                    <div className="stat-info">
                        <h3>Aktiv Elanlar</h3>
                        <p>{attractions.length}</p>
                    </div>
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={18} />
                    <input 
                        type="text" 
                        placeholder="Ad və ya açar sözlə axtarın..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select className="filter-select" value={city} onChange={(e) => setCity(e.target.value)}>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    {STATUSES.map(s => <option key={s} value={s}>{s === 'All Statuses' ? s : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
            </div>

            <div className="listings-section">
                {isLoading ? (
                    <div className="loading-state">Məkanlar yüklənir...</div>
                ) : attractions.length === 0 ? (
                    <div className="empty-state">
                        <MapPin size={48} className="empty-icon" />
                        <h3>Heç bir məkan tapılmadı</h3>
                        <p>Axtarış kriteriyalarınızı dəyişin və ya yeni məkan yaradın.</p>
                        <button onClick={() => navigate('/vendor/attractions/create')}>
                            İlk Məkanını Yarat
                        </button>
                    </div>
                ) : (
                    <div className="attraction-grid">
                        {attractions.map(attraction => {
                            const cover = attraction.images?.find(i => i.isCover)?.url || attraction.images?.[0]?.url;
                            const temp = weatherCache[attraction.city];
                            
                            return (
                                <div key={attraction.id} className="attraction-card">
                                    <div className="card-image">
                                        {cover ? (
                                            <img 
                                                src={getFullImageUrl(cover)} 
                                                alt={attraction.name} 
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Preview';
                                                }}
                                            />
                                        ) : (
                                            <div className="no-image">Şəkil yoxdur</div>
                                        )}
                                        <span className={`status-badge ${attraction.status}`}>
                                            {attraction.status}
                                        </span>
                                        {temp !== undefined && (
                                            <div className="weather-badge">
                                                <CloudSun size={14} />
                                                <span>{temp}°C</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-content">
                                        <h3>{attraction.name}</h3>
                                        <div className="location">
                                            <MapPin size={14} />
                                            <span>{attraction.city} - {attraction.address}</span>
                                        </div>
                                        
                                        <div className="card-metrics">
                                            <span><Star size={14} color="#f59e0b" /> {attraction.stats?.averageRating?.toFixed(1) || '0.0'}</span>
                                            <span><Eye size={14} /> {attraction.stats?.viewCount || 0}</span>
                                            <span><Heart size={14} color="#ef4444" /> {attraction.stats?.favoriteCount || 0}</span>
                                        </div>
                                    </div>
                                    <div className="card-actions">
                                        <button 
                                            className="btn-analytics"
                                            onClick={() => navigate(`/attractions/analytics/${attraction.id}`)}
                                            title="Analitika"
                                        >
                                            <BarChart3 size={16} /> Analiz
                                        </button>
                                        <button 
                                            className="btn-edit"
                                            onClick={() => navigate(`/attractions/edit/${attraction.id}`)}
                                        >
                                            <Edit2 size={16} /> Redaktə
                                        </button>
                                        <button 
                                            className="btn-delete"
                                            onClick={() => handleDelete(attraction.id)}
                                        >
                                            <Trash2 size={16} /> Sil
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
