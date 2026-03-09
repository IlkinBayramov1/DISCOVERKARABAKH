import { httpClient } from '@/shared/api/httpClient';
import type { IHotel, IHotelPayload, IReviewItem } from '../types';

export const hotelApi = {
    // VENDOR: Creates a new hotel listing (Pending approval)
    submitHotelApplication: (data: IHotelPayload) =>
        httpClient<{ message: string; hotelId: string }>('/hotels', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // VENDOR: Get all hotels associated with the vendor
    getVendorHotels: () =>
        httpClient<IHotel[]>('/hotels/vendor/my-hotels'),

    // VENDOR: Get all reviews for vendor's properties
    getVendorReviews: () =>
        httpClient<IReviewItem[]>('/hotels/vendor/reviews'),

    // PUBLIC/VENDOR: Get single hotel by ID
    getHotelById: (id: string) =>
        httpClient<IHotel>(`/hotels/${id}`),

    // VENDOR: Update single hotel by ID
    updateHotel: (id: string, data: Partial<IHotelPayload>) =>
        httpClient<IHotel>(`/hotels/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    // VENDOR: Delete single hotel by ID
    deleteHotel: (id: string) =>
        httpClient<{ message: string }>(`/hotels/${id}`, {
            method: 'DELETE'
        }),
};
