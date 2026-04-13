import { httpClient } from '@/shared/api/httpClient';
import type { 
    IBooking, 
    IPricingCalculationRequest, 
    IPricingCalculationResponse,
    IInventoryLockRequest,
    IInventoryLockResponse
} from '../types';

export const bookingApi = {
    // VENDOR: Get all bookings associated with the vendor's businesses
    getVendorBookings: () =>
        httpClient<IBooking[]>('/bookings/vendor'),

    // VENDOR: Approve or Reject a booking
    updateVendorBookingStatus: (id: string, action: 'approve' | 'reject') =>
        httpClient<{ message: string }>(`/bookings/vendor/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ action })
        }),

    // PRICING: Calculate price for a stay
    calculatePrice: (hotelId: string, data: IPricingCalculationRequest) =>
        httpClient<IPricingCalculationResponse>(`/hotels/${hotelId}/booking/calculate-price`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // INVENTORY: Lock a room inventory temporarily
    lockInventory: (hotelId: string, roomId: string, data: IInventoryLockRequest) =>
        httpClient<IInventoryLockResponse>(`/hotels/${hotelId}/rooms/${roomId}/lock`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    // INVENTORY: Release a room inventory lock
    releaseLock: (hotelId: string, lockId: string) =>
        httpClient<{ message: string }>(`/hotels/${hotelId}/rooms/locks/${lockId}`, {
            method: 'DELETE'
        }),
};
