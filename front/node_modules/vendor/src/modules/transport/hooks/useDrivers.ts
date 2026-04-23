import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportVendorApi } from '../api/transport.api';

export const useDrivers = () => {
    return useQuery({
        queryKey: ['transport-drivers'],
        queryFn: () => transportVendorApi.getDrivers().then(res => res.data),
    });
};

export const useApproveDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            transportVendorApi.approveDriver(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-drivers'] });
        },
    });
};

export const useAssignDriverVehicle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, vehicleId, cargoVehicleId }: { id: string; vehicleId?: string | null; cargoVehicleId?: string | null }) =>
            transportVendorApi.assignDriverVehicle(id, vehicleId || undefined, cargoVehicleId || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-drivers'] });
        },
    });
};
