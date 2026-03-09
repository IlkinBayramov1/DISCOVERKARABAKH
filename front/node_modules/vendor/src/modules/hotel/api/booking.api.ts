import { httpClient } from '@/shared/api/httpClient';
import type { IBooking } from '../types';

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
};
