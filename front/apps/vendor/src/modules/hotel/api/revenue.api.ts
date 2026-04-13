import { httpClient } from '@/shared/api/httpClient';
import type { IPricingRule, IPricingRulePayload } from '../types';

export const revenueApi = {
    // PRICING RULES: Get all automated pricing rules for a hotel
    getPricingRules: (hotelId: string) =>
        httpClient<IPricingRule[]>(`/hotels/${hotelId}/pricing-rules`),

    // PRICING RULES: Create a new pricing rule
    createPricingRule: (hotelId: string, data: IPricingRulePayload) =>
        httpClient<{ message: string }>(`/hotels/${hotelId}/pricing-rules`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // PRICING RULES: Update an existing pricing rule
    updatePricingRule: (hotelId: string, ruleId: string, data: Partial<IPricingRulePayload>) =>
        httpClient<{ message: string }>(`/hotels/${hotelId}/pricing-rules/${ruleId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    // PRICING RULES: Delete a pricing rule
    deletePricingRule: (hotelId: string, ruleId: string) =>
        httpClient<{ message: string }>(`/hotels/${hotelId}/pricing-rules/${ruleId}`, {
            method: 'DELETE',
        }),
};
