import { httpClient } from '../../../shared/api/httpClient';
import type { ITourFilters } from '../types';

export const tourWebApi = {
    getTours: async (filters?: ITourFilters) => {
        const queryParams = new URLSearchParams();
        
        if (filters?.difficulty && filters.difficulty.length > 0) {
            queryParams.append('difficulty', filters.difficulty.join(','));
        }
        
        if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
        if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
        
        const response = await httpClient.get(`/tours?${queryParams.toString()}`);
        return response.data;
    },

    getTourById: async (id: string) => {
        const response = await httpClient.get(`/tours/${id}`);
        return response.data;
    }
};
