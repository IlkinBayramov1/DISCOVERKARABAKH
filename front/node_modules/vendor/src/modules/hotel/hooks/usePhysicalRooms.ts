import { useState, useCallback } from 'react';
import { roomApi } from '../api/room.api';
import type { IPhysicalRoom, IPhysicalRoomPayload, IPhysicalRoomBulkPayload } from '../types';

export function usePhysicalRooms(hotelId: string | undefined) {
    const [physicalRooms, setPhysicalRooms] = useState<IPhysicalRoom[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPhysicalRooms = useCallback(async (filters?: { status?: string; roomTypeId?: string; floor?: string }) => {
        if (!hotelId) return;
        setLoading(true);
        setError(null);
        try {
            const response: any = await roomApi.getPhysicalRooms(hotelId, filters);
            // Account for wrapped successResponse { data: [...] }
            const rooms = response.data || response;
            setPhysicalRooms(Array.isArray(rooms) ? rooms : []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch physical rooms');
        } finally {
            setLoading(false);
        }
    }, [hotelId]);

    const addPhysicalRoom = useCallback(async (data: IPhysicalRoomPayload) => {
        if (!hotelId) return false;
        setLoading(true);
        try {
            await roomApi.createPhysicalRoom(hotelId, data);
            await fetchPhysicalRooms();
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to add room');
            return false;
        } finally {
            setLoading(false);
        }
    }, [hotelId, fetchPhysicalRooms]);

    const bulkAddRooms = useCallback(async (data: IPhysicalRoomBulkPayload) => {
        if (!hotelId) return false;
        setLoading(true);
        try {
            await roomApi.createBulkRooms(hotelId, data);
            await fetchPhysicalRooms();
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to bulk generate rooms');
            return false;
        } finally {
            setLoading(false);
        }
    }, [hotelId, fetchPhysicalRooms]);

    const updateRoomStatus = useCallback(async (roomId: string, data: Partial<IPhysicalRoomPayload>) => {
        if (!hotelId) return false;
        try {
            await roomApi.updatePhysicalRoom(hotelId, roomId, data);
            // Local update for snappier UI
            setPhysicalRooms(prev => prev.map(r => r.id === roomId ? { ...r, ...data } as IPhysicalRoom : r));
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to update status');
            return false;
        }
    }, [hotelId]);

    const deleteRoom = useCallback(async (roomId: string) => {
        if (!hotelId) return false;
        try {
            await roomApi.deletePhysicalRoom(hotelId, roomId);
            setPhysicalRooms(prev => prev.filter(r => r.id !== roomId));
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to delete room');
            return false;
        }
    }, [hotelId]);

    return {
        physicalRooms,
        loading,
        error,
        fetchPhysicalRooms,
        addPhysicalRoom,
        bulkAddRooms,
        updateRoomStatus,
        deleteRoom
    };
}
