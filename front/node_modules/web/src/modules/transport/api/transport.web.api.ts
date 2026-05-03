import { httpClient } from '../../../shared/api/httpClient';

export interface LocationData {
    lat: number;
    lng: number;
    address: string;
}

export interface SearchTaxisPayload {
    pickupLocation?: LocationData;
    dropoffLocation?: LocationData;
    waypoints?: LocationData[];
    distanceKm?: number;
    paxCount?: number;
    vehicleCategory?: string;
    scheduledAt?: string;
}

export interface TaxiSearchResult {
    vehicle: {
        id: string;
        brand: string;
        model: string;
        category: string;
        seats: number;
        luggage: number;
        description?: string;
        images?: string[];
        vendorCompany: string;
    };
    pricing: {
        basePrice: number;
        pricePerKm: number;
        distanceKm: number;
        totalPrice: number;
        currency: string;
    };
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

// Removed legacy dispatch payload

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
    searchTaxis: async (payload: SearchTaxisPayload) => {
        const response = await httpClient.post('/transport/rides/search', payload);
        return response.data as { count: number; data: TaxiSearchResult[] };
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
    },
    getVehicleById: async (id: string) => {
        const response = await httpClient.get(`/transport/vehicles/${id}`);
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
