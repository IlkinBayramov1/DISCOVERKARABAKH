import { useState } from 'react';
import { hotelWebApi } from '../api/hotel.web.api';
import type { ICouponValidation } from '../types';

export function useCouponValidation() {
    const [result, setResult] = useState<ICouponValidation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validate = async (code: string, total: number, hotelId?: string) => {
        setLoading(true);
        setError(null);
        try {
            const data: ICouponValidation = await hotelWebApi.validateCoupon(code, total, hotelId);
            setResult(data);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to validate coupon';
            setError(errorMessage);
            setResult(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const clearCoupon = () => {
        setResult(null);
        setError(null);
    };

    return { validate, clearCoupon, result, loading, error };
}
