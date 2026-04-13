import { useState, useCallback } from 'react';
import { bookingApi } from '../api/booking.api';
import type { IPricingCalculationRequest, IPricingCalculationResponse, IInventoryLockRequest } from '../types';

export function usePricing(hotelId: string | undefined) {
    const [pricing, setPricing] = useState<IPricingCalculationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculatePrice = useCallback(async (payload: IPricingCalculationRequest) => {
        if (!hotelId) return null;
        setLoading(true);
        setError(null);
        try {
            const res = await bookingApi.calculatePrice(hotelId, payload);
            setPricing(res);
            return res;
        } catch (err: any) {
            setError(err.message || 'Failed to calculate price');
            return null;
        } finally {
            setLoading(false);
        }
    }, [hotelId]);

    const lockInventory = useCallback(async (roomTypeId: string, payload: IInventoryLockRequest) => {
        if (!hotelId) return null;
        try {
            return await bookingApi.lockInventory(hotelId, roomTypeId, payload);
        } catch (err: any) {
            setError(err.message || 'Failed to lock inventory');
            return null;
        }
    }, [hotelId]);

    const releaseLock = useCallback(async (lockId: string) => {
        if (!hotelId) return false;
        try {
            await bookingApi.releaseLock(hotelId, lockId);
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to release lock');
            return false;
        }
    }, [hotelId]);

    return {
        pricing,
        loading,
        error,
        calculatePrice,
        lockInventory,
        releaseLock
    };
}
