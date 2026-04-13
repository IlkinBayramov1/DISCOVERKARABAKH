import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2, Trash2, Heart, Star, MapPin } from 'lucide-react';
import { vendorAttractionApi } from '../../api/attraction.api';
import type { Attraction } from '../../types';
import './VendorAttractionDashboard.css';

export default function VendorAttractionDashboard() {
    const navigate = useNavigate();
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadAttractions = async () => {
        try {
            setIsLoading(true);
            const res = await vendorAttractionApi.getAttractions();
            setAttractions(res.data || []);
        } catch (error) {
            console.error('Failed to load attractions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAttractions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this attraction?')) return;
        
        try {
            await vendorAttractionApi.deleteAttraction(id);
            setAttractions(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to delete attraction:', error);
            alert('Failed to delete attraction. It might have active bookings or reviews.');
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
                    <h1>Attractions Dashboard</h1>
                    <p>Manage your properties, tickets, and tourist experiences</p>
                </div>
                <button 
                    className="btn-create" 
                    onClick={() => navigate('/vendor/attractions/create')}
                >
                    <Plus size={20} />
                    Add Attraction
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon views"><Eye size={24} /></div>
                    <div className="stat-info">
                        <h3>Total Views</h3>
                        <p>{totalViews}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon favorites"><Heart size={24} /></div>
                    <div className="stat-info">
                        <h3>Favorites</h3>
                        <p>{totalFavorites}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon rating"><Star size={24} /></div>
                    <div className="stat-info">
                        <h3>Average Rating</h3>
                        <p>{avgRating.toFixed(1)} / 5.0</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon listings"><MapPin size={24} /></div>
                    <div className="stat-info">
                        <h3>Active Listings</h3>
                        <p>{attractions.length}</p>
                    </div>
                </div>
            </div>

            <div className="listings-section">
                <h2>Your Attractions</h2>
                
                {isLoading ? (
                    <div className="loading-state">Loading your attractions...</div>
                ) : attractions.length === 0 ? (
                    <div className="empty-state">
                        <MapPin size={48} className="empty-icon" />
                        <h3>No Attractions Found</h3>
                        <p>You haven't added any attractions or experiences yet.</p>
                        <button onClick={() => navigate('/vendor/attractions/create')}>
                            Create Your First Attraction
                        </button>
                    </div>
                ) : (
                    <div className="attraction-grid">
                        {attractions.map(attraction => {
                            const cover = attraction.images?.find(i => i.isCover)?.url || attraction.images?.[0]?.url;
                            
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
                                            <div className="no-image">No Image</div>
                                        )}
                                        <span className={`status-badge ${attraction.status}`}>
                                            {attraction.status}
                                        </span>
                                    </div>
                                    <div className="card-content">
                                        <h3>{attraction.name}</h3>
                                        <p className="location">{attraction.city} - {attraction.address}</p>
                                        
                                        <div className="card-metrics">
                                            <span><Star size={16} /> {attraction.stats?.averageRating?.toFixed(1) || '0.0'}</span>
                                            <span><Eye size={16} /> {attraction.stats?.viewCount || 0}</span>
                                            <span><Heart size={16} /> {attraction.stats?.favoriteCount || 0}</span>
                                        </div>
                                    </div>
                                    <div className="card-actions">
                                        <button 
                                            className="btn-edit"
                                            onClick={() => navigate(`/attractions/edit/${attraction.id}`)}
                                        >
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button 
                                            className="btn-delete"
                                            onClick={() => handleDelete(attraction.id)}
                                        >
                                            <Trash2 size={16} /> Delete
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
