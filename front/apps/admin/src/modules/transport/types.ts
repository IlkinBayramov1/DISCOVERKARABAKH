export type DriverStatus = 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
export type VehicleStatus = 'Active' | 'Maintenance' | 'Inactive';
export type RideStatus = 'Pending' | 'Accepted' | 'Ongoing' | 'Completed' | 'Cancelled';
export type VehicleCategory = 'Sedan' | 'SUV' | 'Minivan' | 'Bus' | 'Cargo';

export interface DriverProfile {
    id: string;
    userId: string;
    status: DriverStatus;
    firstName: string;
    lastName: string;
    phone: string;
    licenseNumber?: string;
    rating: number;
    totalRides: number;
    currentVehicleId?: string | null;
    currentCargoVehicleId?: string | null;
    vehicle?: Vehicle;
    cargovehicle?: CargoVehicle;
}

export interface Vehicle {
    id: string;
    vendorId: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
    category: VehicleCategory;
    seats: number;
    luggage: number;
    status: VehicleStatus;
    basePrice?: number;
    pricePerKm?: number;
    driverprofile?: DriverProfile;
    user?: {
        email: string;
        vendorprofile?: {
            companyName: string;
        };
    };
}

export interface RidePricingRule {
    id: string;
    name: string;
    type: string;
    basePrice: number;
    pricePerKm?: number;
    pricePerMin?: number;
    minPrice?: number;
    config?: string;
}

export interface Ride {
    id: string;
    passengerId: string;
    driverId?: string;
    vehicleId?: string;
    status: RideStatus;
    pickupLocation: string;
    dropoffLocation: string;
    price?: number;
    distanceKm?: number;
    durationMin?: number;
    scheduledAt?: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    driverprofile?: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
    };
}

export type CargoType = 'Box' | 'Refrigerated' | 'Flatbed' | 'Liquid';
export type CargoVehicleStatus = 'Available' | 'Reserved' | 'Maintenance';
export type ShipmentStatus =
    | 'Pending'
    | 'DriverAssigned'
    | 'VehicleArrived'
    | 'PickedUp'
    | 'InTransit'
    | 'AtDropoff'
    | 'Delivered'
    | 'Completed'
    | 'Cancelled'
    | 'Failed';

export interface CargoVehicle {
    id: string;
    vendorId: string;
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
    cargoType: CargoType;
    maxWeightKg: number;
    maxVolumeM3: number;
    isRefrigerated: boolean;
    temperatureRangeMin?: number;
    temperatureRangeMax?: number;
    insuranceValidUntil?: string;
    status: CargoVehicleStatus;
    currentLoadWeight: number;
    currentLoadVolume: number;
    user?: {
        email: string;
        vendorProfile?: {
            companyName: string;
        };
    };
}

export interface ShipmentPricing {
    id: string;
    shipmentId: string;
    basePrice: number;
    distanceFee: number;
    weightFee: number;
    insuranceFee: number;
    urgencyFee: number;
    tax: number;
    totalPrice: number;
}

export interface Shipment {
    id: string;
    senderId: string;
    driverId?: string;
    cargoVehicleId?: string;
    status: ShipmentStatus;
    pickupLocation: string;
    dropoffLocation: string;
    weightKg: number;
    volumeM3?: number;
    dimensions?: string;
    cargoDescription?: string;
    isHazardous: boolean;
    requiresRefrigeration: boolean;
    declaredValue?: number;
    createdAt: string;
    user: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
    };
    driverprofile?: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
    };
    cargovehicle?: {
        id: string;
        brand: string;
        model: string;
        licensePlate: string;
    } | null;
    shipmentpricing?: ShipmentPricing | null;
}
