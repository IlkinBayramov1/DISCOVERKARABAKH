import { useState } from 'react';
import { hotelWebApi } from '../api/hotel.web.api';
import type { IInventoryLockRequest, IInventoryLock } from '../types';

export function useInventoryLock(hotelId: string | undefined, roomId: string | undefined) {
    const [lock, setLock] = useState<IInventoryLock | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const acquireLock = async (payload: IInventoryLockRequest) => {
        if (!hotelId || !roomId) return;
        setLoading(true);
        setError(null);
        try {
            const data: IInventoryLock = await hotelWebApi.lockRoomInventory(hotelId, roomId, payload);
            setLock(data);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to lock inventory';
            setError(errorMessage);
            setLock(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const releaseLock = async (lockId?: string) => {
        const targetLockId = lockId || lock?.id;
        if (!hotelId || !targetLockId) return;
        
        setLoading(true);
        try {
            await hotelWebApi.releaseRoomLock(hotelId, targetLockId);
            setLock(null);
        } catch (err: any) {
            console.error('Failed to release lock', err);
            // Even if it fails, we clear the local state to prevent blocking the UI
            setLock(null);
        } finally {
            setLoading(false);
        }
    };

    return { acquireLock, releaseLock, lock, loading, error };
}
