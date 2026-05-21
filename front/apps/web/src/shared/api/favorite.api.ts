import { httpClient } from './httpClient';

export type FavoriteType = 'hotel' | 'tour' | 'attraction' | 'vehicle';

export const favoriteApi = {
    toggle: async (targetId: string, type: FavoriteType) => {
        const response = await httpClient.post<{ success: boolean; favorited: boolean }>(
            '/users/favorites/toggle',
            { targetId, type }
        );
        return response.data;
    },

    getFavorites: async () => {
        const response = await httpClient.get<{ success: boolean; data: any }>('/users/favorites');
        return response.data;
    }
};
