import { useState, useEffect } from 'react';
import { hotelWebApi } from '../api/hotel.web.api';
import type { IRoomType } from '../types';

export function useHotelRooms(hotelId: string | undefined, searchParams?: any) {
    const [rooms, setRooms] = useState<IRoomType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = async (id: string, params?: any) => {
        setLoading(true);
        setError(null);
        try {
            const data = await hotelWebApi.getHotelRooms(id, params);
            // The backend returns an array if no pagination, or an object { data, total } if paginated
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
            fetchRooms(hotelId, searchParams);
        } else {
            setRooms([]);
        }
    }, [
        hotelId, 
        searchParams?.checkIn, 
        searchParams?.checkOut, 
        searchParams?.adults, 
        searchParams?.children, 
        searchParams?.rooms,
        searchParams?.category
    ]);

    return { rooms, loading, error, refetch: () => hotelId && fetchRooms(hotelId, searchParams) };
}
