import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessAdminApi } from '../api/business.admin.api';
import type { BusinessType } from '../types';

export const usePendingBusinesses = () => {
    return useQuery({
        queryKey: ['pendingBusinesses'],
        queryFn: businessAdminApi.getPendingBusinesses,
    });
};

export const useApproveBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ type, id }: { type: BusinessType; id: string }) => 
            businessAdminApi.approveBusiness(type, id),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['pendingBusinesses'] });
        },
    });
};
