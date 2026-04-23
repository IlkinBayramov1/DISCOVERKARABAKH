import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportVendorApi } from '../api/transport.api';

export const useRides = () => {
    return useQuery({
        queryKey: ['transport-rides'],
        queryFn: () => transportVendorApi.getRides().then(res => res.data),
    });
};

export const useUpdateRideStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => 
            transportVendorApi.updateRideStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-rides'] });
        },
    });
};
