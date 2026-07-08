import api from '../../../lib/axios';
import type { DriverProfile, Vehicle, RidePricingRule, Ride, CargoVehicle, Shipment } from '../types';

export const transportAdminApi = {
    // 1. Drivers
    getDrivers: async (): Promise<{ success: boolean; data: DriverProfile[] }> => {
        const response = await api.get('/transport/drivers');
        return response.data;
    },

    approveDriver: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.patch(`/transport/drivers/${id}/approve`);
        return response.data;
    },

    createDriver: async (data: any): Promise<{ success: boolean; data: DriverProfile }> => {
        const response = await api.post('/transport/drivers/create', data);
        return response.data;
    },

    getTransportVendors: async (): Promise<{ success: boolean; data: Array<{ id: string; email?: string; companyName?: string }> }> => {
        const response = await api.get('/transport/drivers/vendors');
        return response.data;
    },

    assignDriverVehicle: async (driverId: string, data: { vehicleId?: string | null; cargoVehicleId?: string | null }): Promise<{ success: boolean; data: DriverProfile }> => {
        const response = await api.patch(`/transport/drivers/${driverId}/assign`, data);
        return response.data;
    },

    // 2. Vehicles (Passenger)
    getVehicles: async (): Promise<{ success: boolean; data: Vehicle[] }> => {
        const response = await api.get('/transport/vehicles');
        return response.data;
    },

    createVehicle: async (data: Partial<Vehicle>): Promise<{ success: boolean; data: Vehicle }> => {
        const response = await api.post('/transport/vehicles', data);
        return response.data;
    },

    deleteVehicle: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.delete(`/transport/vehicles/${id}`);
        return response.data;
    },

    // 3. Cargo Vehicles
    getCargoVehicles: async (): Promise<{ success: boolean; data: CargoVehicle[] }> => {
        const response = await api.get('/transport/cargo/vehicles');
        return response.data;
    },

    createCargoVehicle: async (data: Partial<CargoVehicle>): Promise<{ success: boolean; data: CargoVehicle }> => {
        const response = await api.post('/transport/cargo/vehicles', data);
        return response.data;
    },

    deleteCargoVehicle: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.delete(`/transport/cargo/vehicles/${id}`);
        return response.data;
    },

    // 4. Pricing Rules
    getPricingRules: async (): Promise<{ success: boolean; data: RidePricingRule[] }> => {
        const response = await api.get('/transport/pricing');
        return response.data;
    },

    createPricingRule: async (data: Partial<RidePricingRule>): Promise<{ success: boolean; data: RidePricingRule }> => {
        const response = await api.post('/transport/pricing', data);
        return response.data;
    },

    updatePricingRule: async (id: string, data: Partial<RidePricingRule>): Promise<{ success: boolean; data: RidePricingRule }> => {
        const response = await api.put(`/transport/pricing/${id}`, data);
        return response.data;
    },

    deletePricingRule: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.delete(`/transport/pricing/${id}`);
        return response.data;
    },

    // 5. Rides
    getRides: async (): Promise<{ success: boolean; data: Ride[] }> => {
        const response = await api.get('/transport/rides/all');
        return response.data;
    },

    // 6. Cargo Shipments
    getCargoShipments: async (): Promise<{ success: boolean; data: Shipment[] }> => {
        const response = await api.get('/transport/cargo/shipments');
        return response.data;
    },

    assignShipmentDriver: async (shipmentId: string, data: { cargoVehicleId: string; driverProfileId: string }): Promise<{ success: boolean; data: Shipment }> => {
        const response = await api.post(`/transport/cargo/shipments/${shipmentId}/assign`, data);
        return response.data;
    },

    advanceShipmentStatus: async (shipmentId: string, data: { nextStatus?: string; status?: string; extraPayload?: any }): Promise<{ success: boolean; data: Shipment }> => {
        const response = await api.patch(`/transport/cargo/shipments/${shipmentId}/status`, data);
        return response.data;
    },

    // 7. Locations
    getLocations: async (): Promise<{ success: boolean; data: any[] }> => {
        const response = await api.get('/transport/passenger/location/manage');
        return response.data;
    }
};

export default transportAdminApi;
