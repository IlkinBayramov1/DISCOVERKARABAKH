import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userAdminApi from '../api/user.admin.api';

/** Admin panelində istifadəçi siyahısını gətirən hook */
export const useUsers = () => {
    return useQuery({
        queryKey: ['admin', 'users'],
        queryFn: () => userAdminApi.getUsers()
    });
};

/** Tək bir istifadəçinin bütün detallarını gətirən hook */
export const useUserDetails = (id: string) => {
    return useQuery({
        queryKey: ['admin', 'users', 'detail', id],
        queryFn: () => userAdminApi.getUserDetails(id),
        enabled: !!id
    });
};

/** İstifadəçi əməliyyatlarını (ban, approve, delete) idarə edən hook */
export const useUserActions = () => {
    const queryClient = useQueryClient();

    /** Ban əməliyyatı */
    const banMutation = useMutation({
        mutationFn: (id: string) => userAdminApi.banUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        }
    });

    /** Banın qaldırılması */
    const unbanMutation = useMutation({
        mutationFn: (id: string) => userAdminApi.unbanUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        }
    });

    /** Vendorun təsdiqlənməsi */
    const approveMutation = useMutation({
        mutationFn: (id: string) => userAdminApi.approveUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        }
    });

    /** Vendorun rədd edilməsi */
    const rejectMutation = useMutation({
        mutationFn: (id: string) => userAdminApi.rejectUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        }
    });

    /** İstifadəçinin silinməsi */
    const deleteMutation = useMutation({
        mutationFn: (id: string) => userAdminApi.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        }
    });

    return {
        banUser: banMutation.mutateAsync,
        isBanning: banMutation.isPending,

        unbanUser: unbanMutation.mutateAsync,
        isUnbanning: unbanMutation.isPending,

        approveUser: approveMutation.mutateAsync,
        isApproving: approveMutation.isPending,

        rejectUser: rejectMutation.mutateAsync,
        isRejecting: rejectMutation.isPending,

        deleteUser: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending
    };
};
