import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportVendorApi } from '../api/transport.api';
import type { IPricingRule } from '../types';

export const usePricingRules = () => {
    return useQuery({
        queryKey: ['transport-pricing-rules'],
        queryFn: () => transportVendorApi.getPricingRules().then(res => res.data),
    });
};

export const useCreatePricingRule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<IPricingRule>) => transportVendorApi.createPricingRule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-pricing-rules'] });
        },
    });
};

export const useUpdatePricingRule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<IPricingRule> }) => 
            transportVendorApi.updatePricingRule(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-pricing-rules'] });
        },
    });
};

export const useDeletePricingRule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => transportVendorApi.deletePricingRule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-pricing-rules'] });
        },
    });
};
