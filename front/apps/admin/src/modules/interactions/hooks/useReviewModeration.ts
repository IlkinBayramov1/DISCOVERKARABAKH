import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reviewAdminApi from '../api/review.admin.api';
import type { ReviewStatus } from '../types';

/** Bütün rəyləri (filtrli) gətirən hook */
export const useReviews = (params?: any) => {
    return useQuery({
        queryKey: ['admin', 'reviews', params],
        queryFn: () => reviewAdminApi.getReviews(params)
    });
};

/** Rəy moderasiyası (approve, reject, delete) üçün hook */
export const useReviewActions = () => {
    const queryClient = useQueryClient();

    /** Statusu yeniləyir */
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status, type }: { id: string, status: ReviewStatus, type: 'general' | 'attraction' }) => 
            reviewAdminApi.updateReviewStatus(id, status, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
        }
    });

    /** Rəyi silir */
    const deleteMutation = useMutation({
        mutationFn: ({ id, type }: { id: string, type: 'general' | 'room' | 'attraction' }) => 
            reviewAdminApi.deleteReview(id, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
        }
    });

    return {
        updateStatus: updateStatusMutation.mutateAsync,
        isUpdating: updateStatusMutation.isPending,
        
        deleteReview: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending
    };
};
