import { httpClient } from '../../../shared/api/httpClient';
import type { ITourFilters } from '../types';
export const tourWebApi = {
    getTours: async (filters?: ITourFilters) => {
        const queryParams = new URLSearchParams();
        
        if (filters?.page) queryParams.append('page', filters.page.toString());
        if (filters?.limit) queryParams.append('limit', filters.limit.toString());
        if (filters?.city) queryParams.append('city', filters.city);
        if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
        if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
        
        const response = await httpClient.get(`/tours?${queryParams.toString()}`);
        return response.data;
    },

    getTourById: async (id: string) => {
        const response = await httpClient.get(`/tours/${id}`);
        return response.data;
    },

    getTourBySlug: async (slug: string) => {
        const response = await httpClient.get(`/tours/slug/${slug}`);
        return response.data;
    },

    getTourAvailability: async (id: string, date: string) => {
        const response = await httpClient.get(`/tours/${id}/availability?date=${date}`);
        return response.data;
    }
};
