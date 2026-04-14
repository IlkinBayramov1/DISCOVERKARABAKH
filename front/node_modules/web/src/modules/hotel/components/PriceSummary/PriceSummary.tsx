import React from 'react';
import type { IPricingCalculationResponse } from '../../types';

interface PriceSummaryProps {
    pricing: IPricingCalculationResponse | null;
    loading?: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ pricing, loading }) => {
    if (loading) return <div className="price-summary-loading">Calculating...</div>;
    if (!pricing) return null;

    return (
        <div className="price-summary-card">
            {/* TODO: Build invoice UI here using pricing.grossTotal, pricing.totalTaxes, etc. */}
            <h3>Price Breakdown</h3>
            <p>Total: {pricing.exactTotal} {pricing.currency || 'AZN'}</p>
        </div>
    );
};
