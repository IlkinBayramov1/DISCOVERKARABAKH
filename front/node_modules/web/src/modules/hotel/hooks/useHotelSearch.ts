import { useState, useEffect } from 'react';
import { hotelWebApi } from '../api/hotel.web.api';
import type { HotelSearchParams } from '../api/hotel.web.api';
import type { IHotel } from '../types';

export function useHotelSearch(initialParams: HotelSearchParams) {
    const [hotels, setHotels] = useState<IHotel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHotels = async (params: HotelSearchParams) => {
        setLoading(true);
        setError(null);
        try {
            const data = await hotelWebApi.searchHotels(params);

            // The backend returns an array if no pagination, or an object { data, total } if paginated
            if (data?.data && Array.isArray(data.data)) {
                setHotels(data.data);
            } else if (Array.isArray(data)) {
                setHotels(data);
            } else {
                setHotels([]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch hotels');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels(initialParams);
    }, [
        initialParams.city,
        initialParams.q,
        initialParams.guests,
        initialParams.starRating,
        initialParams.minPrice,
        initialParams.maxPrice,
        initialParams.minRating,
        initialParams.sortBy,
        initialParams.adults,
        initialParams.children,
        initialParams.rooms,
        // Using JSON.stringify for array fields deeply compares them
        initialParams.amenityNames ? JSON.stringify(initialParams.amenityNames) : null,
        initialParams.lat,
        initialParams.lng,
        initialParams.radiusKm
    ]);

    return { hotels, loading, error, refetch: fetchHotels };
}
