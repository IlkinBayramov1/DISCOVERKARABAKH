import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportVendorApi } from '../api/transport.api';
import type { IVehicle } from '../types';

export const useVehicles = () => {
    return useQuery({
        queryKey: ['transport-vehicles'],
        queryFn: () => transportVendorApi.getVehicles().then(res => res.data),
    });
};

export const useCreateVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<IVehicle>) => transportVendorApi.createVehicle(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-vehicles'] });
        },
    });
};

export const useUpdateVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<IVehicle> }) => 
            transportVendorApi.updateVehicle(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-vehicles'] });
        },
    });
};

export const useDeleteVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => transportVendorApi.deleteVehicle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-vehicles'] });
        },
    });
};
