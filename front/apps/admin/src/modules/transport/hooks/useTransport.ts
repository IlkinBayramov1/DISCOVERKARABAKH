import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import transportAdminApi from '../api/transport.admin.api';
import type { Vehicle, RidePricingRule, CargoVehicle } from '../types';

// 1. Drivers Hooks
export const useDrivers = () => {
    return useQuery({
        queryKey: ['admin', 'transport', 'drivers'],
        queryFn: () => transportAdminApi.getDrivers()
    });
};

export const useApproveDriver = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => transportAdminApi.approveDriver(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'drivers'] });
        }
    });
};

export const useCreateDriver = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => transportAdminApi.createDriver(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'drivers'] });
        }
    });
};

export const useTransportVendors = () => {
    return useQuery({
        queryKey: ['admin', 'transport', 'vendors'],
        queryFn: () => transportAdminApi.getTransportVendors()
    });
};

export const useAssignDriverVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ driverId, data }: { driverId: string; data: { vehicleId?: string | null; cargoVehicleId?: string | null } }) =>
            transportAdminApi.assignDriverVehicle(driverId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'drivers'] });
        }
    });
};

// 2. Passenger Vehicles Hooks
export const useVehicles = () => {
    return useQuery({
        queryKey: ['admin', 'transport', 'vehicles'],
        queryFn: () => transportAdminApi.getVehicles()
    });
};

export const useCreateVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Vehicle>) => transportAdminApi.createVehicle(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'vehicles'] });
        }
    });
};

export const useDeleteVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => transportAdminApi.deleteVehicle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'vehicles'] });
        }
    });
};

// 3. Cargo Vehicles Hooks
export const useCargoVehicles = () => {
    return useQuery({
        queryKey: ['admin', 'transport', 'cargo-vehicles'],
        queryFn: () => transportAdminApi.getCargoVehicles()
    });
};

export const useCreateCargoVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<CargoVehicle>) => transportAdminApi.createCargoVehicle(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'cargo-vehicles'] });
        }
    });
};

export const useDeleteCargoVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => transportAdminApi.deleteCargoVehicle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'cargo-vehicles'] });
        }
    });
};

// 4. Pricing Rules Hooks
export const usePricingRules = () => {
    return useQuery({
        queryKey: ['admin', 'transport', 'pricing-rules'],
        queryFn: () => transportAdminApi.getPricingRules()
    });
};

export const useCreatePricingRule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<RidePricingRule>) => transportAdminApi.createPricingRule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'pricing-rules'] });
        }
    });
};

export const useUpdatePricingRule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<RidePricingRule> }) => 
            transportAdminApi.updatePricingRule(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'pricing-rules'] });
        }
    });
};

export const useDeletePricingRule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => transportAdminApi.deletePricingRule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'pricing-rules'] });
        }
    });
};

// 5. Rides Hooks
export const useRides = () => {
    return useQuery({
        queryKey: ['admin', 'transport', 'rides'],
        queryFn: () => transportAdminApi.getRides()
    });
};

// 6. Cargo Shipments Hooks
export const useCargoShipments = () => {
    return useQuery({
        queryKey: ['admin', 'transport', 'cargo-shipments'],
        queryFn: () => transportAdminApi.getCargoShipments()
    });
};

export const useAssignShipmentDriver = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ shipmentId, data }: { shipmentId: string; data: { cargoVehicleId: string; driverProfileId: string } }) =>
            transportAdminApi.assignShipmentDriver(shipmentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'cargo-shipments'] });
        }
    });
};

export const useAdvanceShipmentStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ shipmentId, data }: { shipmentId: string; data: { nextStatus?: string; status?: string; extraPayload?: any } }) =>
            transportAdminApi.advanceShipmentStatus(shipmentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'transport', 'cargo-shipments'] });
        }
    });
};

export const useLocations = () => {
    return useQuery({
        queryKey: ['admin', 'transport', 'locations'],
        queryFn: () => transportAdminApi.getLocations()
    });
};
