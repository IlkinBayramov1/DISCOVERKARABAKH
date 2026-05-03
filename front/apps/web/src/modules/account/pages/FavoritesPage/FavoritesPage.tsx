import React, { useEffect, useState } from 'react';
import { favoriteApi } from '../../../../shared/api/favorite.api';
import { HotelCard } from '../../../hotel/components/HotelCard/HotelCard';
import { TourCard } from '../../../tour/components/TourCard.tsx';
import { AttractionCard } from '../../../attraction/components/AttractionCard/AttractionCard';
import { TransferCard } from '../../../transport/pages/passenger/TransferCard';
import { Heart, Loader2 } from 'lucide-react';
import './FavoritesPage.css';

export const FavoritesPage: React.FC = () => {
    const [favorites, setFavorites] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'hotels' | 'tours' | 'attractions' | 'vehicles'>('hotels');

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await favoriteApi.getFavorites();
                if (res.success) {
                    setFavorites(res.data);
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    if (loading) {
        return (
            <div className="favorites-loading">
                <Loader2 className="animate-spin" size={40} color="#6a28c7" />
                <span>Loading your favorites...</span>
            </div>
        );
    }

    const renderContent = () => {
        const items = favorites?.[activeTab] || [];
        if (items.length === 0) {
            return (
                <div className="favorites-empty">
                    <Heart size={60} color="#e2e8f0" />
                    <h3>No favorite {activeTab} yet</h3>
                    <p>Start exploring and save your favorite {activeTab} to see them here.</p>
                </div>
            );
        }

        return (
            <div className="favorites-grid">
                {activeTab === 'hotels' && items.map((item: any) => <HotelCard key={item.id} hotel={item} isFavorited={true} />)}
                {activeTab === 'tours' && items.map((item: any) => <TourCard key={item.id} tour={item} isFavorited={true} />)}
                {activeTab === 'attractions' && items.map((item: any) => <AttractionCard key={item.id} attraction={item} isFavorited={true} />)}
                {activeTab === 'vehicles' && items.map((item: any) => (
                    <TransferCard 
                        key={item.id} 
                        taxi={{ vehicle: item, pricing: { totalPrice: item.basePrice || 0, currency: 'AZN' } } as any} 
                        onClick={() => {}} 
                        hasRoute={false}
                        isFavorited={true}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <h1>My Favorites</h1>
                <p>Saved places and services for your next trip</p>
            </div>

            <div className="favorites-tabs">
                {(['hotels', 'tours', 'attractions', 'vehicles'] as const).map(tab => (
                    <button 
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        <span className="count-badge">{favorites?.[tab]?.length || 0}</span>
                    </button>
                ))}
            </div>

            <div className="favorites-content">
                {renderContent()}
            </div>
        </div>
    );
};
