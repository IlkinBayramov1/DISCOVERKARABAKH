import { useState, useCallback, useEffect } from 'react';
import { hotelApi } from '../api/hotel.api';
import type { IHotel, IHotelPayload } from '../types';

export function useHotels(autoFetch = true) {
    const [data, setData] = useState<IHotel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHotels = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await hotelApi.getVendorHotels();
            // Assuming response could be wrapped in standard API response object { data: [] }
            const payload = (response as unknown as Record<string, unknown>).data || response;
            setData(payload as IHotel[]);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to fetch hotels');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchHotels();
        }
    }, [autoFetch, fetchHotels]);

    const createHotel = async (payload: IHotelPayload) => {
        setLoading(true);
        setError(null);
        try {
            await hotelApi.submitHotelApplication(payload);
            await fetchHotels(); // Refetch automatically
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to create hotel');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeHotel = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await hotelApi.deleteHotel(id);
            await fetchHotels(); // Refresh list after deletion
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete hotel');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        refetch: fetchHotels,
        createHotel,
        removeHotel
    };
}
