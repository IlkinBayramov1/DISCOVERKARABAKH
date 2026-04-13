import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4004/api/v1';

export const attractionApi = {
    // PUBLIC //
    getAttractions: async (params?: Record<string, any>) => {
        const response = await axios.get(`${API_URL}/attractions`, { params });
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

    submitReview: async (id: string, data: { rating: number; comment?: string }, token: string) => {
        const response = await axios.post(
            `${API_URL}/user/attractions/${id}/reviews`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }
};
