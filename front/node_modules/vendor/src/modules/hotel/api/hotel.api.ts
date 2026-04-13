import { httpClient } from '@/shared/api/httpClient';
import type { IHotel, IHotelPayload, IReviewItem, ICouponValidation, IRoomType } from '../types';

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

    // VENDOR: Get all room types associated with the vendor
    getVendorRooms: () =>
        httpClient<IRoomType[]>('/hotels/vendor/my-rooms'),

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

    // VENDOR: Validate coupon for a specific hotel/amount
    validateCoupon: (code: string, total: number, hotelId?: string) =>
        httpClient<ICouponValidation>('/hotels/validate-coupon', {
            method: 'POST',
            body: JSON.stringify({ code, total, hotelId })
        }),
    
    // VENDOR: Reply to a review
    replyToReview: (reviewId: string, reply: string) =>
        httpClient<{ message: string }>(`/hotels/reviews/${reviewId}/reply`, {
            method: 'POST',
            body: JSON.stringify({ reply })
        })
};
