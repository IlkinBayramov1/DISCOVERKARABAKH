import api from '../../../lib/axios';
import type {
    AdminBookingsResponse,
    AdminBookingDetailResponse,
    AdminBookingActionResponse,
    BookingStatus
} from '../types';

export const bookingAdminApi = {
    /** Bütün bronları gətirir (status, tip və s. filtrli) */
    getBookings: async (params?: any): Promise<AdminBookingsResponse> => {
        const response = await api.get('/admins/bookings', { params });
        return response.data;
    },

    /** Bronun detallarını (qonaqlar, audit loqları) gətirir */
    getBookingDetails: async (id: string): Promise<AdminBookingDetailResponse> => {
        const response = await api.get(`/admins/bookings/${id}`);
        return response.data;
    },

    /** Bron statusunu yeniləyir və qeyd əlavə edir */
    updateBookingStatus: async (id: string, status: BookingStatus, note?: string): Promise<AdminBookingActionResponse> => {
        const response = await api.patch(`/admins/bookings/${id}/status`, { status, note });
        return response.data;
    }
};

export default bookingAdminApi;
