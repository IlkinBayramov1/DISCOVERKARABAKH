export interface IVehicle {
    id: string;
    brand: string;
    model: string;
    plateNumber: string;
    category: 'Economy' | 'Business' | 'Premium' | 'Minivan' | 'Bus';
    seats: number;
    year?: number;
    color?: string;
    status: 'Active' | 'UnderMaintenance' | 'Inactive';
    ownerId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICargoVehicle {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
    type: string;
    maxWeightKg: number;
    maxVolumeM3?: number;
    status: 'Available' | 'OnTrip' | 'Maintenance';
    ownerId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IDriverProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    licenseNumber: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Available' | 'OnTrip' | 'Offline';
    vendorId: string;
    currentVehicleId?: string;
    currentCargoVehicleId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IPricingRule {
    id: string;
    name: string;
    type: 'Fixed' | 'PerKm' | 'Hourly';
    basePrice: number;
    pricePerKm?: number;
    pricePerMin?: number;
    config?: Record<string, any>;
    vendorId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IRide {
    id: string;
    bookingNumber?: string;
    passengerId: string;
    passenger?: {
        email: string;
        firstName?: string;
        lastName?: string;
    };
    driverId?: string;
    driver?: {
        firstName: string;
        lastName: string;
    };
    vehicleId?: string;
    vehicle?: {
        brand: string;
        model: string;
        plateNumber: string;
    };
    pickupLocation: any;
    dropoffLocation: any;
    waypoints?: any;
    status: string;
    price: number;
    distanceKm?: number;
    durationMin?: number;
    paxCount?: number;
    scheduledAt?: string;
    createdAt: string;
}

export interface IShipment {
    id: string;
    bookingNumber?: string;
    senderId: string;
    sender?: {
        email: string;
        firstName?: string;
        lastName?: string;
    };
    driverId?: string;
    driver?: {
        firstName: string;
        lastName: string;
    };
    cargoVehicleId?: string;
    cargoVehicle?: {
        brand: string;
        model: string;
        licensePlate: string;
    };
    pickupLocation: any;
    dropoffLocation: any;
    waypoints?: any;
    status: string;
    weightKg: number;
    volumeM3?: number;
    price?: number;
    scheduledAt?: string;
    createdAt: string;
}

export interface ITransportLocation {
    id?: string;
    _id?: string;
    name: string;
    address: string;
    googleMapsUrl?: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    type: 'Hotel' | 'Airport' | 'Attraction' | 'Custom';
    vendorId?: string | null;
    popularity?: number;
    seats?: number;
}
