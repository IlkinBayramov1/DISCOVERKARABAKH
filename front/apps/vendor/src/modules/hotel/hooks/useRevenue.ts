import { useState, useCallback } from 'react';
import { revenueApi } from '../api/revenue.api';
import type { IPricingRule, IPricingRulePayload } from '../types';

export function useRevenue(hotelId: string | undefined) {
    const [rules, setRules] = useState<IPricingRule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRules = useCallback(async () => {
        if (!hotelId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await revenueApi.getPricingRules(hotelId);
            // Handle possible response wrapper
            const payload = (response as any).data || response;
            setRules(Array.isArray(payload) ? payload : []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch pricing rules');
        } finally {
            setLoading(false);
        }
    }, [hotelId]);

    const addRule = async (data: IPricingRulePayload) => {
        if (!hotelId) return false;
        setLoading(true);
        try {
            await revenueApi.createPricingRule(hotelId, data);
            await fetchRules();
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to add pricing rule');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateRule = async (ruleId: string, data: Partial<IPricingRulePayload>) => {
        if (!hotelId) return false;
        try {
            await revenueApi.updatePricingRule(hotelId, ruleId, data);
            await fetchRules();
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to update pricing rule');
            return false;
        }
    };

    const removeRule = async (ruleId: string) => {
        if (!hotelId) return false;
        try {
            await revenueApi.deletePricingRule(hotelId, ruleId);
            setRules(prev => prev.filter(r => r.id !== ruleId));
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to delete pricing rule');
            return false;
        }
    };

    return {
        rules,
        loading,
        error,
        fetchRules,
        addRule,
        updateRule,
        removeRule
    };
}
