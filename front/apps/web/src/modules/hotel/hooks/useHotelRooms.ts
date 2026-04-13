import { useState, useEffect } from 'react';
import { hotelWebApi } from '../api/hotel.web.api';
import type { IRoomType } from '../types';

export function useHotelRooms(hotelId: string | undefined) {
    const [rooms, setRooms] = useState<IRoomType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await hotelWebApi.getHotelRooms(id);

            // Depends on backend response structure. Assuming `data` or `data.data`
            if (data?.data && Array.isArray(data.data)) {
                setRooms(data.data);
            } else if (Array.isArray(data)) {
                setRooms(data);
            } else {
                setRooms([]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load rooms');
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hotelId) {
            fetchRooms(hotelId);
        } else {
            setRooms([]);
        }
    }, [hotelId]);

    return { rooms, loading, error, refetch: () => hotelId && fetchRooms(hotelId) };
}
