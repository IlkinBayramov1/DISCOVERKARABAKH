import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import promotionAdminApi from '../api/promotion.admin.api';
import type { PromotionCreateInput } from '../types';

/** Bütün promosiyaların siyahısını gətirən hook */
export const usePromotions = () => {
    return useQuery({
        queryKey: ['admin', 'promotions'],
        queryFn: () => promotionAdminApi.getPromotions()
    });
};

/** Promosiya əməliyyatlarını (yaratma, silmə) idarə edən hook */
export const usePromotionActions = () => {
    const queryClient = useQueryClient();

    /** Yeni kod yaradılması */
    const createMutation = useMutation({
        mutationFn: (data: PromotionCreateInput) => promotionAdminApi.createPromotion(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
        }
    });

    /** Kodun silinməsi */
    const deleteMutation = useMutation({
        mutationFn: (id: string) => promotionAdminApi.deletePromotion(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
        }
    });

    return {
        createPromotion: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        
        deletePromotion: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending
    };
};
