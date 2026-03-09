import { useState, useCallback, useEffect } from 'react';
import { roomApi } from '../api/room.api';
import type { IRoomType, IRoomTypePayload } from '../types';

export function useRooms(hotelId: string | undefined, autoFetch = true) {
    const [rooms, setRooms] = useState<IRoomType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await (hotelId ? roomApi.getRoomsByHotel(hotelId) : roomApi.getVendorRooms());
            const payload = (response as unknown as Record<string, unknown>).data || response;
            setRooms(payload as IRoomType[]);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to fetch rooms');
            }
        } finally {
            setLoading(false);
        }
    }, [hotelId]);

    useEffect(() => {
        if (autoFetch) {
            fetchRooms();
        }
    }, [autoFetch, hotelId, fetchRooms]);

    const addRoomType = async (payload: IRoomTypePayload) => {
        if (!hotelId) throw new Error("Hotel ID is required");

        setLoading(true);
        setError(null);
        try {
            await roomApi.createRoomType(hotelId, payload);
            await fetchRooms(); // Refetch
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to add room type');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const editRoomType = async (roomId: string, payload: Partial<IRoomTypePayload>) => {
        if (!hotelId) throw new Error("Hotel ID is required");

        setLoading(true);
        setError(null);
        try {
            await roomApi.updateRoomType(hotelId, roomId, payload);
            await fetchRooms(); // Refetch
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to update room type');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeRoomType = async (roomId: string) => {
        if (!hotelId) throw new Error("Hotel ID is required");

        setLoading(true);
        setError(null);
        try {
            await roomApi.deleteRoomType(hotelId, roomId);
            await fetchRooms(); // Refetch
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete room type');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        rooms,
        loading,
        error,
        refetch: fetchRooms,
        addRoomType,
        editRoomType,
        removeRoomType
    };
}
