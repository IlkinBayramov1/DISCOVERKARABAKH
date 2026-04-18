import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import bookingAdminApi from '../api/booking.admin.api';
import type { BookingStatus } from '../types';

/** Bütün bronların siyahısını (filtrli) gətirən hook */
export const useBookings = (params?: any) => {
    return useQuery({
        queryKey: ['admin', 'bookings', params],
        queryFn: () => bookingAdminApi.getBookings(params)
    });
};

/** Tək bir bronun detallarını gətirən hook */
export const useBookingDetails = (id: string) => {
    return useQuery({
        queryKey: ['admin', 'bookings', 'detail', id],
        queryFn: () => bookingAdminApi.getBookingDetails(id),
        enabled: !!id
    });
};

/** Bron statusunu yeniləmək üçün hook */
export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status, note }: { id: string, status: BookingStatus, note?: string }) => 
            bookingAdminApi.updateBookingStatus(id, status, note),
        onSuccess: (_, variables) => {
            // Həm siyahını, həm də detalları yeniləyirik
            queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'bookings', 'detail', variables.id] });
        }
    });
};
