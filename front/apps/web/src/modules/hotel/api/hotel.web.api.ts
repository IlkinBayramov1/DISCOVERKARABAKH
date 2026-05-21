import { httpClient } from '../../../shared/api/httpClient';

export interface HotelSearchParams {
    city?: string;
    q?: string;

    // Dates & Occupancy
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
    rooms?: number;

    // Temporary legacy format
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
        if (params.q) queryParams.append('q', params.q);
        if (params.guests) queryParams.append('guests', params.guests);
        if (params.checkIn) queryParams.append('checkIn', params.checkIn);
        if (params.checkOut) queryParams.append('checkOut', params.checkOut);
        if (params.adults) queryParams.append('adults', params.adults.toString());
        if (params.children) queryParams.append('children', params.children.toString());
        if (params.rooms) queryParams.append('rooms', params.rooms.toString());
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

    getHotelRooms: async (hotelId: string, params?: any) => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }
        const queryStr = queryParams.toString();
        const response = await httpClient.get(`/hotels/${hotelId}/rooms${queryStr ? '?' + queryStr : ''}`);
        return response.data;
    },

    getRoomById: async (hotelId: string, roomId: string, params?: any) => {
        const queryStr = params ? new URLSearchParams(params).toString() : '';
        const response = await httpClient.get(`/hotels/${hotelId}/rooms/${roomId}${queryStr ? '?' + queryStr : ''}`);
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
    },

    validateCoupon: async (code: string, total: number, hotelId?: string) => {
        const payload: any = { code, total };
        if (hotelId) payload.hotelId = hotelId;
        const response = await httpClient.post('/hotels/validate-coupon', payload);
        return response.data;
    },

    calculateBookingPrice: async (hotelId: string, payload: import('../types').IPricingCalculationRequest) => {
        const response = await httpClient.post(`/hotels/${hotelId}/booking/calculate-price`, payload);
        return response.data;
    },

    lockRoomInventory: async (hotelId: string, roomId: string, payload: import('../types').IInventoryLockRequest) => {
        const response = await httpClient.post(`/hotels/${hotelId}/rooms/${roomId}/lock`, payload);
        return response.data;
    },

    releaseRoomLock: async (hotelId: string, lockId: string) => {
        const response = await httpClient.delete(`/hotels/${hotelId}/rooms/locks/${lockId}`);
        return response.data;
    }
};
