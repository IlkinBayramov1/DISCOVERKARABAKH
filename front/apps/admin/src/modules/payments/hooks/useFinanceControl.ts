import { useQuery } from '@tanstack/react-query';
import { financeAdminApi } from '../api/finance.admin.api';

/** Maliyyə tranzaksiyalarının siyahısını gətirən hook */
export const useTransactions = (params?: any) => {
    return useQuery({
        queryKey: ['admin', 'finance', 'transactions', params],
        queryFn: () => financeAdminApi.getTransactions(params)
    });
};

/** Tək bir tranzaksiyanın detallarını gətirən hook */
export const useTransactionDetails = (id: string) => {
    return useQuery({
        queryKey: ['admin', 'finance', 'transactions', 'detail', id],
        queryFn: () => financeAdminApi.getTransactionDetails(id),
        enabled: !!id
    });
};

/** Şirkət dövriyyə statistikasını gətirən hook */
export const useCompanyFinanceStats = (params?: any) => {
    return useQuery({
        queryKey: ['admin', 'finance', 'stats', 'companies', params],
        queryFn: () => financeAdminApi.getCompanyStats(params)
    });
};

/** İstifadəçi cüzdan və xərc statistikasını gətirən hook */
export const useUserFinanceStats = (params?: any) => {
    return useQuery({
        queryKey: ['admin', 'finance', 'stats', 'users', params],
        queryFn: () => financeAdminApi.getUserStats(params)
    });
};

/** İstifadəçinin ətraflı maliyyə hesabatı detallarını (cüzdan, kart, bronlar) gətirən hook */
export const useUserFinancialDetails = (userId: string) => {
    return useQuery({
        queryKey: ['admin', 'finance', 'stats', 'users', 'detail', userId],
        queryFn: () => financeAdminApi.getUserFinancialDetails(userId),
        enabled: !!userId
    });
};
