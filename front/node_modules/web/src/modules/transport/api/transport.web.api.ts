import { httpClient } from '../../../shared/api/httpClient';

export interface LocationData {
    lat: number;
    lng: number;
    address: string;
}

export interface CalculatePricePayload {
    pickupLocation?: LocationData;
    dropoffLocation?: LocationData;
    waypoints?: LocationData[];
    distanceKm?: number;
    durationMin?: number;
    category: string;
}

export interface DriverRegistrationPayload {
    firstName: string;
    lastName: string;
    phone: string;
    licenseNumber: string;
    managedById?: string; // Vendor ID
    
    driverType: 'passenger' | 'cargo';

    // Vehicle (Base)
    vehicleBrand: string;
    vehicleModel: string;
    vehicleColor: string;
    vehiclePlateNumber: string;
    
    // Passenger
    vehicleSeats?: number;
    vehicleCategory?: string;

    // Cargo
    maxWeightKg?: number;
    maxVolumeM3?: number;
    cargoType?: string;
}

export interface CreateRidePayload {
    pickupLocation: LocationData;
    dropoffLocation: LocationData;
    waypoints?: LocationData[];
    distanceKm?: number;
    durationMin?: number;
    vehicleCategory: string;
}

export interface CreateShipmentPayload {
    pickupLocation: LocationData;
    dropoffLocation: LocationData;
    waypoints?: LocationData[];
    weightKg: number;
    volumeM3?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    cargoDescription?: string;
    isHazardous?: boolean;
    requiresRefrigeration?: boolean;
    declaredValue?: number;
}

export const transportApi = {
    calculatePrice: async (payload: CalculatePricePayload) => {
        const response = await httpClient.post('/transport/price/calculate', payload);
        return response.data;
    },
    createRide: async (payload: CreateRidePayload) => {
        const response = await httpClient.post('/transport/rides', payload);
        return response.data;
    },
    createShipment: async (payload: CreateShipmentPayload) => {
        const response = await httpClient.post('/transport/cargo/shipments', payload);
        return response.data;
    },
    // Driver
    getTransportVendors: async () => {
        const response = await httpClient.get('/transport/drivers/vendors');
        return response.data;
    },
    getDriverProfile: async () => {
        const response = await httpClient.get('/transport/drivers/me');
        return response.data;
    },
    registerDriver: async (payload: DriverRegistrationPayload) => {
        const response = await httpClient.post('/transport/drivers/register', payload);
        return response.data;
    }
};

export const transportDriverApi = {
    getProfile: async () => {
        const response = await httpClient.get('/transport/drivers/me');
        return response.data;
    },
    updateStatus: async (status: 'Online' | 'Offline' | 'Busy') => {
        const response = await httpClient.patch('/transport/drivers/me/status', { status });
        return response.data;
    },
    // Passenger
    getRides: async () => {
        // Will need backend route /transport/rides/me or query ?driverId=me
        const response = await httpClient.get('/transport/rides/me');
        return response.data;
    },
    updateRideStatus: async (rideId: string, status: string) => {
        const response = await httpClient.patch(`/transport/rides/${rideId}/status`, { status });
        return response.data;
    },
    // Cargo
    getShipments: async () => {
        const response = await httpClient.get('/transport/cargo/shipments/me');
        return response.data;
    },
    updateShipmentStatus: async (shipmentId: string, status: string, extraPayload?: any) => {
        const response = await httpClient.patch(`/transport/cargo/shipments/${shipmentId}/status`, { nextStatus: status, ...extraPayload });
        return response.data;
    }
};
