import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportVendorApi } from '../api/transport.api';
import type { ITransportLocation } from '../types';

export const useTransportLocations = () => {
    return useQuery({
        queryKey: ['transport-locations'],
        queryFn: () => transportVendorApi.getLocations().then(res => res.data),
    });
};

export const useCreateTransportLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<ITransportLocation>) => transportVendorApi.createLocation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-locations'] });
        },
    });
};

export const useUpdateTransportLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ITransportLocation> }) => 
            transportVendorApi.updateLocation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-locations'] });
        },
    });
};

export const useDeleteTransportLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => transportVendorApi.deleteLocation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-locations'] });
        },
    });
};
