import { httpClient } from '../../../shared/api/httpClient';

export interface BookingPreviewParams {
    type: string; // 'hotel', 'tour', 'event'
    entityId: string;
    participants?: number;
    tourDate?: string;
    items: Array<{
        roomTypeId?: string;
        ratePlanId?: string;
        checkIn: string;
        checkOut: string;
        adults: number;
        children: number;
    }>;
}

export interface CreateBookingParams extends BookingPreviewParams {
    guests: Array<{
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
        idNumber?: string;
    }>;
    paymentMethod: string;
    specialRequests?: string;
}

export const bookingApi = {
    previewPrice: async (params: BookingPreviewParams) => {
        const response = await httpClient.post('/bookings/preview', params);
        return response.data;
    },

    createBooking: async (params: CreateBookingParams) => {
        const response = await httpClient.post('/bookings', params);
        return response.data;
    },

    getBookingDetails: async (bookingId: string) => {
        const response = await httpClient.get(`/bookings/my/${bookingId}`);
        return response.data;
    },

    getMyBookings: async () => {
        const response = await httpClient.get('/bookings/my');
        return response.data;
    }
};
