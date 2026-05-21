import { useState } from 'react';
import { hotelWebApi } from '../api/hotel.web.api';
import type { IPricingCalculationRequest, IPricingCalculationResponse } from '../types';

export function usePricing(hotelId: string | undefined) {
    const [pricing, setPricing] = useState<IPricingCalculationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculate = async (payload: IPricingCalculationRequest) => {
        if (!hotelId) return;
        setLoading(true);
        setError(null);
        try {
            const data: IPricingCalculationResponse = await hotelWebApi.calculateBookingPrice(hotelId, payload);
            setPricing(data);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to calculate pricing';
            setError(errorMessage);
            setPricing(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const clearPricing = () => {
        setPricing(null);
        setError(null);
    };

    return { calculate, clearPricing, pricing, loading, error };
}
