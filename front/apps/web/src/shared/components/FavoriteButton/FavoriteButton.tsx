import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { favoriteApi } from '../../api/favorite.api';
import type { FavoriteType } from '../../api/favorite.api';
import { useAuth } from '../../context/AuthContext';
import './FavoriteButton.css';

interface FavoriteButtonProps {
    targetId: string;
    type: FavoriteType;
    initialIsFavorited?: boolean;
    className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    targetId,
    type,
    initialIsFavorited = false,
    className = ''
}) => {
    const { isAuthenticated } = useAuth();
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [isLoading, setIsLoading] = useState(false);

    // Sync local state if prop changes (important for search results or page refreshes)
    React.useEffect(() => {
        setIsFavorited(initialIsFavorited);
    }, [initialIsFavorited]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            // Optional: Show login modal or toast
            alert('Please login to save favorites');
            return;
        }

        setIsLoading(true);
        try {
            const res = await favoriteApi.toggle(targetId, type);
            if (res.success) {
                setIsFavorited(res.favorited);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            className={`favorite-btn-premium ${isFavorited ? 'active' : ''} ${isLoading ? 'loading' : ''} ${className}`}
            onClick={handleToggle}
            disabled={isLoading}
            title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
        >
            <Heart 
                size={20} 
                fill={isFavorited ? 'currentColor' : 'transparent'} 
                strokeWidth={isFavorited ? 0 : 2}
            />
        </button>
    );
};
