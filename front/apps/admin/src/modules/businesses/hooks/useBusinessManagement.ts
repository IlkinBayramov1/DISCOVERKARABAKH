import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import businessAdminApi from '../api/business.admin.api';
import type { BusinessType } from '../types';

/** Bütün biznes siyahısını (filtrli) gətirən hook */
export const useBusinesses = (type?: BusinessType, status?: string) => {
    return useQuery({
        queryKey: ['admin', 'businesses', type, status],
        queryFn: () => businessAdminApi.getAllBusinesses(type, status)
    });
};

/** Təsdiq gözləyən müraciətləri gətirən hook */
export const usePendingBusinesses = () => {
    return useQuery({
        queryKey: ['admin', 'businesses', 'pending'],
        queryFn: () => businessAdminApi.getPendingBusinesses()
    });
};

/** Biznesi təsdiqləyən hook */
export const useApproveBusiness = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ type, id }: { type: BusinessType, id: string }) => 
            businessAdminApi.approveBusiness(type, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
        }
    });
};

/** Biznesi rədd edən hook */
export const useRejectBusiness = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ type, id }: { type: BusinessType, id: string }) => 
            businessAdminApi.rejectBusiness(type, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
        }
    });
};

/** Hotel detallarını gətirən hook */
export const useHotelDetails = (id: string | null) => {
    return useQuery({
        queryKey: ['admin', 'businesses', 'hotel', id],
        queryFn: () => businessAdminApi.getHotelDetails(id!),
        enabled: !!id
    });
};

/** Biznes əməliyyatlarını (approve, reject) bir yerdə idarə edən hook (Geri uyğunluq üçün) */
export const useBusinessActions = () => {
    const approve = useApproveBusiness();
    const reject = useRejectBusiness();

    return {
        approveBusiness: approve.mutateAsync,
        isApproving: approve.isPending,
        
        rejectBusiness: reject.mutateAsync,
        isRejecting: reject.isPending
    };
};
