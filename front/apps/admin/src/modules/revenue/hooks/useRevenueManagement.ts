import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import revenueAdminApi from '../api/revenue.admin.api';

/** Gəlir hesabatlarını gətirən hook */
export const useRevenueReport = (params?: any) => {
    return useQuery({
        queryKey: ['admin', 'revenue', 'report', params],
        queryFn: () => revenueAdminApi.getRevenueReport(params)
    });
};

/** Satıcı ödənişlərini gətirən hook */
export const usePayouts = (params?: any) => {
    return useQuery({
        queryKey: ['admin', 'revenue', 'payouts', params],
        queryFn: () => revenueAdminApi.getPayouts(params)
    });
};

/** Ödənişi emal etmək üçün hook */
export const useProcessPayout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => revenueAdminApi.processPayout(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'revenue', 'payouts'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'revenue', 'report'] });
        }
    });
};
