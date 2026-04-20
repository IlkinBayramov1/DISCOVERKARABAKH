import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4004/api/v1';

export const attractionApi = {
    // PUBLIC //
    getAttractions: async (params?: { q?: string; city?: string; categoryId?: string; status?: string; isFeatured?: boolean; entryType?: string; page?: number; limit?: number }) => {
        const response = await axios.get(`${API_URL}/attractions`, { params });
        return response.data;
    },

    getNearbyAttractions: async (params: { lat: number; lng: number; radiusKm?: number; limit?: number }) => {
        const response = await axios.get(`${API_URL}/attractions/nearby`, { params });
        return response.data;
    },

    getAttractionById: async (idOrSlug: string) => {
        const response = await axios.get(`${API_URL}/attractions/${idOrSlug}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await axios.get(`${API_URL}/attractions/categories`);
        return response.data;
    },

    getReviews: async (attractionId: string, params?: Record<string, any>) => {
        const response = await axios.get(`${API_URL}/attractions/${attractionId}/reviews`, { params });
        return response.data;
    },

    recordView: async (id: string) => {
        const response = await axios.post(`${API_URL}/attractions/${id}/view`);
        return response.data;
    },

    getWeather: async (id: string) => {
        const response = await axios.get(`${API_URL}/attractions/${id}/weather`);
        return response.data;
    },

    reportReview: async (attractionId: string, reviewId: string, data: { reason: string; customNote?: string }, token: string) => {
        const response = await axios.post(
            `${API_URL}/attractions/${attractionId}/reviews/${reviewId}/report`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    // USER ACTIONS (Requires Auth via token interceptor or manual config) //
    toggleFavorite: async (id: string, token: string) => {
        const response = await axios.post(
            `${API_URL}/user/attractions/${id}/favorite`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    getUserFavorites: async (token: string) => {
        const response = await axios.get(`${API_URL}/user/attractions/favorites`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    submitReview: async (id: string, data: { rating: number; comment?: string; images?: string[] }, token: string) => {
        const response = await axios.post(
            `${API_URL}/attractions/${id}/reviews`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    updateReview: async (id: string, reviewId: string, data: { rating?: number; comment?: string }, token: string) => {
        const response = await axios.put(
            `${API_URL}/attractions/${id}/reviews/${reviewId}`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    deleteReview: async (id: string, reviewId: string, token: string) => {
        const response = await axios.delete(
            `${API_URL}/attractions/${id}/reviews/${reviewId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }
};
