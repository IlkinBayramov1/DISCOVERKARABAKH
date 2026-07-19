import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportVendorApi } from '../api/transport.api';
import { httpClient } from '../../../shared/api/httpClient';
import type { UpdateDriverLicenseRequest } from '../types';

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

export const useCreateDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => transportVendorApi.createDriver(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-drivers'] });
        },
    });
};

export const useUpdateDriverLicense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDriverLicenseRequest }) =>
            transportVendorApi.updateDriverLicense(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transport-drivers'] });
        },
    });
};

export const useUploadImages = () => {
    return useMutation({
        mutationFn: async (files: File[]) => {
            const uploadData = new FormData();
            files.forEach(file => {
                uploadData.append('images', file);
            });
            const res = await httpClient<{ success: boolean; urls: string[] }>('/upload', {
                method: 'POST',
                body: uploadData
            });
            if (!res.success) {
                throw new Error('Upload failed');
            }
            return res.urls;
        }
    });
};
