import { httpClient } from '@/shared/api/httpClient';
import type { IRoomType, IRoomTypePayload } from '../types';

export const roomApi = {
    // VENDOR: Get all room types internally managed under a specific hotel
    getRoomsByHotel: (hotelId: string) =>
        httpClient<IRoomType[]>(`/hotels/${hotelId}/rooms`),

    // VENDOR: Get all room types managed by the vendor across all hotels
    getVendorRooms: () =>
        httpClient<IRoomType[]>('/hotels/vendor/my-rooms'),

    // VENDOR: Add a new room type to the hotel
    createRoomType: (hotelId: string, data: IRoomTypePayload) =>
        httpClient<IRoomType>(`/hotels/${hotelId}/rooms`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // VENDOR: Update room inventory/pricing limits/etc.
    updateRoomType: (hotelId: string, roomId: string, data: Partial<IRoomTypePayload>) =>
        httpClient<IRoomType>(`/hotels/${hotelId}/rooms/${roomId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    // VENDOR: Remove a room type
    deleteRoomType: (hotelId: string, roomId: string) =>
        httpClient<void>(`/hotels/${hotelId}/rooms/${roomId}`, {
            method: 'DELETE',
        }),
};
