import { useQuery } from '@tanstack/react-query';
import financeAdminApi from '../api/finance.admin.api';

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
