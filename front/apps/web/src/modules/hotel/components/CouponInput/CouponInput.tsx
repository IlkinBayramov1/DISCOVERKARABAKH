import React, { useState } from 'react';
import { useCouponValidation } from '../../hooks/useCouponValidation';

interface CouponInputProps {
    hotelId?: string;
    totalAmount: number;
    onSuccess?: (discountData: any) => void;
}

export const CouponInput: React.FC<CouponInputProps> = ({ hotelId, totalAmount, onSuccess }) => {
    const [code, setCode] = useState('');
    const { validate, loading, error, result } = useCouponValidation();

    const handleApply = async () => {
        if (!code) return;
        const data = await validate(code, totalAmount, hotelId);
        if (data && onSuccess) onSuccess(data);
    };

    return (
        <div className="coupon-input-wrapper">
            {/* TODO: Add input and apply button UI */}
            <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Promo Code" />
            <button onClick={handleApply} disabled={loading}>{loading ? 'Applying...' : 'Apply'}</button>
            {error && <span className="error-msg">{error}</span>}
            {result && <span className="success-msg">Discount applied!</span>}
        </div>
    );
};
