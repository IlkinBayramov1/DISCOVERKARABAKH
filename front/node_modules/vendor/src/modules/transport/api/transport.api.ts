import { httpClient } from '../../../shared/api/httpClient';
import type { IVehicle, ICargoVehicle, IDriverProfile, IPricingRule, IRide, IShipment, ITransportLocation } from '../types';

export const transportVendorApi = {
    // Fleet Management (Passenger)
    getVehicles: () => httpClient<IVehicle[]>('/transport/vehicles'),
    createVehicle: (data: Partial<IVehicle>) => httpClient<IVehicle>('/transport/vehicles', { method: 'POST', body: JSON.stringify(data) }),
    updateVehicle: (id: string, data: Partial<IVehicle>) => httpClient<IVehicle>(`/transport/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteVehicle: (id: string) => httpClient<{ success: boolean }>(`/transport/vehicles/${id}`, { method: 'DELETE' }),

    // Fleet Management (Cargo)
    getCargoVehicles: () => httpClient<ICargoVehicle[]>('/transport/cargo/vehicles'),
    createCargoVehicle: (data: Partial<ICargoVehicle>) => httpClient<ICargoVehicle>('/transport/cargo/vehicles', { method: 'POST', body: JSON.stringify(data) }),
    updateCargoVehicle: (id: string, data: Partial<ICargoVehicle>) => httpClient<ICargoVehicle>(`/transport/cargo/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCargoVehicle: (id: string) => httpClient<{ success: boolean }>(`/transport/cargo/vehicles/${id}`, { method: 'DELETE' }),

    // Drivers
    getDrivers: () => httpClient<IDriverProfile[]>('/transport/drivers'),
    approveDriver: (id: string, status: string) => httpClient<IDriverProfile>(`/transport/drivers/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    assignDriverVehicle: (id: string, vehicleId?: string, cargoVehicleId?: string) => httpClient<IDriverProfile>(`/transport/drivers/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ vehicleId, cargoVehicleId }) }),

    // Pricing Rules
    getPricingRules: () => httpClient<IPricingRule[]>('/transport/pricing'),
    createPricingRule: (data: Partial<IPricingRule>) => httpClient<IPricingRule>('/transport/pricing', { method: 'POST', body: JSON.stringify(data) }),
    updatePricingRule: (id: string, data: Partial<IPricingRule>) => httpClient<IPricingRule>(`/transport/pricing/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePricingRule: (id: string) => httpClient<{ success: boolean }>(`/transport/pricing/${id}`, { method: 'DELETE' }),

    // Orders Tracking
    getRides: () => httpClient<IRide[]>('/transport/rides'),
    updateRideStatus: (id: string, status: string) => httpClient<IRide>(`/transport/rides/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    getShipments: () => httpClient<IShipment[]>('/transport/cargo/shipments'),
    updateShipmentStatus: (id: string, status: string) => httpClient<IShipment>(`/transport/cargo/shipments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

    // Locations
    getLocations: () => httpClient<ITransportLocation[]>('/transport/passenger/location/manage'),
    createLocation: (data: Partial<ITransportLocation>) => httpClient<ITransportLocation>('/transport/passenger/location', { method: 'POST', body: JSON.stringify(data) }),
    updateLocation: (id: string, data: Partial<ITransportLocation>) => httpClient<ITransportLocation>(`/transport/passenger/location/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteLocation: (id: string) => httpClient<{ success: boolean }>(`/transport/passenger/location/${id}`, { method: 'DELETE' }),
};
