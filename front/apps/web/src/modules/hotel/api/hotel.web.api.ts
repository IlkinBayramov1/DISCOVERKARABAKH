import { httpClient } from '../../../shared/api/httpClient';

export interface HotelSearchParams {
    city?: string;
    q?: string;
    guests?: string;
    starRating?: number;
    priceRange?: number;

    // Advanced filters
    amenityNames?: string[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: string;
    
    // Geographical filters
    lat?: number;
    lng?: number;
    radiusKm?: number;
}

export const hotelWebApi = {
    searchHotels: async (params: HotelSearchParams) => {
        const queryParams = new URLSearchParams();
        if (params.city) queryParams.append('city', params.city);
        if (params.q) queryParams.append('search', params.q); // backend uses 'search'
        if (params.starRating) queryParams.append('starRating', params.starRating.toString());

        // Geography filters
        if (params.lat) queryParams.append('lat', params.lat.toString());
        if (params.lng) queryParams.append('lng', params.lng.toString());
        if (params.radiusKm) queryParams.append('radiusKm', params.radiusKm.toString());

        // Advanced filtering
        if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
        if (params.minRating) queryParams.append('minRating', params.minRating.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);

        // Amenities
        if (params.amenityNames && params.amenityNames.length > 0) {
            queryParams.append('amenityNames', params.amenityNames.join(','));
        }

        const response = await httpClient.get(`/hotels?${queryParams.toString()}`);
        return response.data;
    },

    getHotelById: async (id: string) => {
        const response = await httpClient.get(`/hotels/${id}`);
        return response.data;
    },

    getHotelRooms: async (hotelId: string) => {
        const response = await httpClient.get(`/hotels/${hotelId}/rooms`);
        return response.data;
    },

    getReviews: async (hotelId: string, page: number = 1, limit: number = 10) => {
        const response = await httpClient.get(`/hotels/${hotelId}/reviews?page=${page}&limit=${limit}`);
        return response.data;
    },

    createReview: async (hotelId: string, data: any) => {
        const response = await httpClient.post(`/hotels/${hotelId}/reviews`, data);
        return response.data;
    },

    getRoomReviews: async (hotelId: string, roomId: string, page: number = 1, limit: number = 10) => {
        const response = await httpClient.get(`/hotels/${hotelId}/rooms/${roomId}/reviews?page=${page}&limit=${limit}`);
        return response.data;
    },

    createRoomReview: async (hotelId: string, roomId: string, data: any) => {
        const response = await httpClient.post(`/hotels/${hotelId}/rooms/${roomId}/reviews`, data);
        return response.data;
    }
};
