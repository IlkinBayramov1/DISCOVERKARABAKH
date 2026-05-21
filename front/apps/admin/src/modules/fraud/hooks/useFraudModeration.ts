import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import fraudAdminApi from '../api/fraud.admin.api';
import type { BlacklistCreateInput } from '../types';

/** Qara siyahını gətirən hook */
export const useBlacklist = () => {
    return useQuery({
        queryKey: ['admin', 'fraud', 'blacklist'],
        queryFn: () => fraudAdminApi.getBlacklist()
    });
};

/** Qara siyahı əməliyyatlarını (əlavə etmə, silmə) idarə edən hook */
export const useBlacklistActions = () => {
    const queryClient = useQueryClient();

    /** Əlavə etmə */
    const addMutation = useMutation({
        mutationFn: (data: BlacklistCreateInput) => fraudAdminApi.addToBlacklist(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'fraud', 'blacklist'] });
        }
    });

    /** Silmə */
    const removeMutation = useMutation({
        mutationFn: (id: string) => fraudAdminApi.removeFromBlacklist(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'fraud', 'blacklist'] });
        }
    });

    return {
        addToBlacklist: addMutation.mutateAsync,
        isAdding: addMutation.isPending,
        
        removeFromBlacklist: removeMutation.mutateAsync,
        isRemoving: removeMutation.isPending
    };
};

/** Sistem risk loqlarını gətirən hook */
export const useRiskLogs = (params?: any) => {
    return useQuery({
        queryKey: ['admin', 'fraud', 'risk-logs', params],
        queryFn: () => fraudAdminApi.getRiskLogs(params)
    });
};
