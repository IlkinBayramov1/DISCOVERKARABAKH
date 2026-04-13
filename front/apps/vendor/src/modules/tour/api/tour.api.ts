import { httpClient } from '@/shared/api/httpClient';
import type { ITour, ITourPayload } from '../types';

export const tourApi = {
    // VENDOR: Get all tours associated with the vendor
    getVendorTours: () =>
        httpClient<ITour[]>('/tours/vendor/my-tours'),

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
};
