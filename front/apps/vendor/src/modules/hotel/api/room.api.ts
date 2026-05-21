import { httpClient } from '@/shared/api/httpClient';
import type { 
    IRoomType, 
    IRoomTypePayload, 
    IPhysicalRoom, 
    IPhysicalRoomPayload, 
    IPhysicalRoomBulkPayload,
    IRoomReview,
    IRoomReviewPayload
} from '../types';

export const roomApi = {
    // ROOM TYPES
    getRoomsByHotel: (hotelId: string) =>
        httpClient<IRoomType[]>(`/hotels/${hotelId}/rooms`),

    getVendorRooms: () =>
        httpClient<IRoomType[]>('/hotels/vendor/my-rooms'),

    createRoomType: (hotelId: string, data: IRoomTypePayload) =>
        httpClient<IRoomType>(`/hotels/${hotelId}/rooms`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updateRoomType: (hotelId: string, roomId: string, data: Partial<IRoomTypePayload>) =>
        httpClient<IRoomType>(`/hotels/${hotelId}/rooms/${roomId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    deleteRoomType: (hotelId: string, roomId: string) =>
        httpClient<void>(`/hotels/${hotelId}/rooms/${roomId}`, {
            method: 'DELETE',
        }),

    // ROOM REVIEWS
    getRoomReviews: (hotelId: string, roomId: string, params?: { page?: number; limit?: number }) => {
        const query = new URLSearchParams(params as any).toString();
        return httpClient<{ reviews: IRoomReview[]; total: number; page: number; totalPages: number }>(
            `/hotels/${hotelId}/rooms/${roomId}/reviews${query ? `?${query}` : ''}`
        );
    },

    submitRoomReview: (hotelId: string, roomId: string, data: IRoomReviewPayload) =>
        httpClient<void>(`/hotels/${hotelId}/rooms/${roomId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // PHYSICAL ROOMS & HOUSEKEEPING
    getPhysicalRooms: (hotelId: string, filters?: { status?: string; roomTypeId?: string; floor?: string }) => {
        const query = new URLSearchParams(filters as any).toString();
        return httpClient<IPhysicalRoom[]>(`/hotels/${hotelId}/rooms/physical-rooms${query ? `?${query}` : ''}`);
    },

    createPhysicalRoom: (hotelId: string, data: IPhysicalRoomPayload) =>
        httpClient<IPhysicalRoom>(`/hotels/${hotelId}/rooms/physical-rooms`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    createBulkRooms: (hotelId: string, data: IPhysicalRoomBulkPayload) =>
        httpClient<{ count: number }>(`/hotels/${hotelId}/rooms/physical-rooms/bulk`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updatePhysicalRoom: (hotelId: string, roomId: string, data: Partial<IPhysicalRoomPayload>) =>
        httpClient<IPhysicalRoom>(`/hotels/${hotelId}/rooms/physical-rooms/${roomId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    deletePhysicalRoom: (hotelId: string, roomId: string) =>
        httpClient<void>(`/hotels/${hotelId}/rooms/physical-rooms/${roomId}`, {
            method: 'DELETE',
        }),
};
