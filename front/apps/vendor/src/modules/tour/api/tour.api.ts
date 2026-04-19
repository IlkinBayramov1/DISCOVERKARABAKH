import { httpClient } from '@/shared/api/httpClient';
import type { ITour, ITourPayload, ITourAvailabilityResponse } from '../types';

export const tourApi = {
    // VENDOR: Get all tours associated with the vendor (with pagination)
    getVendorTours: (params?: { page?: number; limit?: number; city?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return httpClient<{ success: boolean; data: ITour[]; count: number }>(`/tours/vendor/my-tours?${query}`);
    },

    // VENDOR: Create a new tour listing
    createTour: (data: ITourPayload) =>
        httpClient<{ success: boolean; data: ITour }>('/tours', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // PUBLIC/VENDOR: Get single tour by ID
    getTourById: (id: string) =>
        httpClient<ITour>(`/tours/${id}`),

    // VENDOR: Update single tour by ID
    updateTour: (id: string, data: Partial<ITourPayload>) =>
        httpClient<ITour>(`/tours/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    // VENDOR: Delete single tour by ID
    deleteTour: (id: string) =>
        httpClient<{ success: boolean; message: string }>(`/tours/${id}`, {
            method: 'DELETE'
        }),

    // PUBLIC/VENDOR: Check tour availability for a specific date
    getTourAvailability: (id: string, date: string) =>
        httpClient<{ success: boolean; data: ITourAvailabilityResponse }>(`/tours/${id}/availability?date=${date}`),

    // VENDOR: Get bookings for the vendor's tours
    getVendorBookings: () =>
        httpClient<{ success: boolean; data: any[] }>('/bookings/vendor')
};
