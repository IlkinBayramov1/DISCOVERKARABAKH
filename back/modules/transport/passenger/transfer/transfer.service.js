import { transferRepository } from './transfer.repository.js';
import { ApiError } from '../../../../core/api.error.js';
import prisma from '../../../../config/db.js';
import { createClient } from 'redis';
import crypto from 'crypto';
import { calculateDistance } from '../../../../core/utils/distance.util.js';
import { trackingService } from '../../tracking/tracking.service.js';

let redisClient;
try {
    redisClient = createClient({
        socket: { reconnectStrategy: false }
    });
    redisClient.on('error', (err) => { /* Suppress error spam */ });
    redisClient.connect().catch(() => { });
} catch (e) {
    console.error("Redis connection failed to initialize in Transfer Service");
}

const RIDE_STATES = {
    PENDING: 'Pending',
    DRIVER_ASSIGNED: 'DriverAssigned',
    ON_WAY_TO_PICKUP: 'OnWayToPickup',
    ARRIVED_AT_PICKUP: 'ArrivedAtPickup',
    ONGOING: 'Ongoing',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
};

class TransferService {
    async searchTaxis(data) {
        let { pickupLocation, dropoffLocation, paxCount: rawPaxCount, scheduledAt } = data;
        const paxCount = parseInt(rawPaxCount) || 1;

        // Fallback Haversine Calculation if DistanceKm is not provided by Frontend OSRM Router
        let distanceKm = data.distanceKm;
        if (!distanceKm && pickupLocation && dropoffLocation) {
            distanceKm = calculateDistance(
                pickupLocation.lat, pickupLocation.lng,
                dropoffLocation.lat, dropoffLocation.lng
            );
        }

        // 3-hour buffer logic
        let busyVehicleIds = [];
        if (scheduledAt) {
            const requestedTime = new Date(scheduledAt);
            const bufferStart = new Date(requestedTime.getTime() - 3 * 60 * 60 * 1000);
            const bufferEnd = new Date(requestedTime.getTime() + 3 * 60 * 60 * 1000);

            const conflictingRides = await prisma.ride.findMany({
                where: {
                    status: { notIn: ['Cancelled', 'Completed'] },
                    scheduledAt: {
                        gte: bufferStart,
                        lte: bufferEnd
                    },
                    vehicleId: { not: null }
                },
                select: { vehicleId: true }
            });
            busyVehicleIds = conflictingRides.map(r => r.vehicleId);
        }

        // Find active Vendor Vehicles that can fit paxCount
        const vehicles = await prisma.vehicle.findMany({
            where: {
                status: 'Active',
                id: { notIn: busyVehicleIds },
                seats: { gte: paxCount || 1 },
                category: data.vehicleCategory || undefined
            },
            include: {
                owner: { select: { vendorProfile: { select: { companyName: true } } } }
            }
        });

        // Calculate specific price for each vehicle based on its Vendor's basePrice and pricePerKm
        const availableTaxis = vehicles.map(vehicle => {
            const basePrice = vehicle.basePrice || 5.0; // Fallbacks if vendor hasn't set
            const ratePerKm = vehicle.pricePerKm || 1.5;
            let totalPrice = basePrice + ((distanceKm || 0) * ratePerKm);

            return {
                vehicle: {
                    id: vehicle.id,
                    brand: vehicle.brand,
                    model: vehicle.model,
                    category: vehicle.category,
                    seats: vehicle.seats,
                    images: vehicle.images,
                    vendorCompany: vehicle.owner?.vendorProfile?.companyName || 'Standard Taxi'
                },
                pricing: {
                    basePrice,
                    pricePerKm: ratePerKm,
                    distanceKm: parseFloat((distanceKm || 0).toFixed(2)),
                    totalPrice: parseFloat(totalPrice.toFixed(2)),
                    currency: 'AZN'
                }
            };
        });

        // Sort from cheap to expensive
        availableTaxis.sort((a, b) => a.pricing.totalPrice - b.pricing.totalPrice);

        return availableTaxis;
    }

    async getTransferById(id) {
        const transfer = await transferRepository.findById(id);
        if (!transfer) throw ApiError.notFound('Transfer not found');
        return transfer;
    }

    async getUserTransfers(userId, query) {
        return transferRepository.findAll({ ...query, passengerId: userId });
    }

    async getDriverTransfers(driverId, query) {
        return transferRepository.findAll({ ...query, driverId });
    }

    async getAllTransfers(userId, role, query) {
        let filter = { ...query };
        if (role === 'vendor') {
            filter.vendorId = userId; // Secure isolation
        }
        return transferRepository.findAll(filter);
    }

    async updateStatus(id, status, userId) {
        // Normalize status to PascalCase for consistency with DB Enum
        const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        // Handle special case for "Ongoing" which normalized would be "Ongoing" (correct)
        // Handle special case for "DriverAssigned" etc.
        let finalStatus = normalizedStatus;
        if (normalizedStatus === 'Completed') finalStatus = 'Completed';
        if (normalizedStatus === 'Cancelled') finalStatus = 'Cancelled';

        // Manual override for complex names if needed, but PascalCase normalization usually works
        // for 'driverassigned' -> 'Driverassigned' (Incorrect, should be 'DriverAssigned')

        // Let's use a mapping for normalization to be safe
        const statusMap = {
            'pending': 'Pending',
            'driverassigned': 'DriverAssigned',
            'onwaytopickup': 'OnWayToPickup',
            'arrivedatpickup': 'ArrivedAtPickup',
            'ongoing': 'Ongoing',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };

        const safeStatus = statusMap[status.toLowerCase()] || normalizedStatus;

        const transfer = await this.getTransferById(id);

        // FINAL STATES (Cannot move from here)
        if (transfer.status === RIDE_STATES.COMPLETED || transfer.status === RIDE_STATES.CANCELLED) {
            throw ApiError.badRequest(`Cannot update status of a finalized ride (${transfer.status})`);
        }

        // Admin/Vendor can bypass lifecycle and go straight to final states
        if (safeStatus === RIDE_STATES.COMPLETED || safeStatus === RIDE_STATES.CANCELLED) {
            return transferRepository.update(id, { status: safeStatus });
        }

        // STATE MACHINE GUARDS for normal lifecycle transitions
        const validTransitions = {
            [RIDE_STATES.PENDING]: [RIDE_STATES.DRIVER_ASSIGNED, RIDE_STATES.CANCELLED],
            [RIDE_STATES.DRIVER_ASSIGNED]: [RIDE_STATES.ON_WAY_TO_PICKUP, RIDE_STATES.CANCELLED],
            [RIDE_STATES.ON_WAY_TO_PICKUP]: [RIDE_STATES.ARRIVED_AT_PICKUP, RIDE_STATES.CANCELLED],
            [RIDE_STATES.ARRIVED_AT_PICKUP]: [RIDE_STATES.ONGOING, RIDE_STATES.CANCELLED],
            [RIDE_STATES.ONGOING]: [RIDE_STATES.COMPLETED],
            [RIDE_STATES.COMPLETED]: [],
            [RIDE_STATES.CANCELLED]: []
        };

        if (!validTransitions[transfer.status] || !validTransitions[transfer.status].includes(safeStatus)) {
            throw ApiError.badRequest(`Invalid state transition from ${transfer.status} to ${safeStatus}`);
        }

        return transferRepository.update(id, { status: safeStatus });
    }

    async assignDriver(rideId, driverId) {
        if (!redisClient || !redisClient.isOpen) {
            throw ApiError.internal('Dispatch Engine (Redis) is currently offline.');
        }

        // REDIS ATOMIC LOCK (REDLOCK implementation)
        // Mutex lock to prevent two background workers assigning the same ride concurrently
        const lockKey = `ride:${rideId}:lock`;
        const acquiredLock = await redisClient.set(lockKey, '1', {
            NX: true, // Only Set if Not Exists
            EX: 5     // Expire after 5 seconds
        });

        if (!acquiredLock) {
            throw ApiError.conflict('Ride assignment currently locked by another process. Race condition prevented.');
        }

        try {
            const transfer = await this.getTransferById(rideId);
            if (transfer.status !== RIDE_STATES.REQUESTED && transfer.status !== RIDE_STATES.MATCHING) {
                throw ApiError.badRequest('Ride is no longer available for assignment.');
            }

            const updatedRide = await transferRepository.update(rideId, {
                driverId,
                status: RIDE_STATES.DRIVER_ASSIGNED
            });

            return updatedRide;
        } finally {
            // Release the Mutex Lock
            await redisClient.del(lockKey);
        }
    }

    async acceptRide(rideId, driverProfileId) {
        const transfer = await this.getTransferById(rideId);

        if (transfer.status !== RIDE_STATES.DRIVER_ASSIGNED || transfer.driverId !== driverProfileId) {
            throw ApiError.badRequest('Ride is no longer available or was unassigned.');
        }

        // Update to accepted
        const updated = await this.updateStatus(rideId, RIDE_STATES.DRIVER_ACCEPTED, null);

        // Broadcast to Passenger that Driver is coming
        trackingService.broadcastRideUpdate(rideId, 'driver_accepted', updated);

        return updated;
    }

    async rejectRide(rideId, driverProfileId, pickupLocation, requiredSeats, requiredCategory) {
        const transfer = await this.getTransferById(rideId);

        if (transfer.status === RIDE_STATES.DRIVER_ASSIGNED && transfer.driverId === driverProfileId) {
            console.log(`❌ [Platform] Driver ${driverProfileId} rejected assigned Ride ${rideId}`);

            // Revert status so vendor can re-assign
            await transferRepository.update(rideId, { driverId: null, status: RIDE_STATES.MATCHING });
        }
        return { success: true };
    }

    async updateLifecycle(rideId, driverProfileId, nextState) {
        const transfer = await this.getTransferById(rideId);

        if (transfer.driverId !== driverProfileId && driverProfileId !== 'admin') {
            throw ApiError.forbidden('Only the assigned driver can update this ride');
        }

        const validLifecycleStates = [RIDE_STATES.ARRIVED, RIDE_STATES.STARTED, RIDE_STATES.COMPLETED];
        if (!validLifecycleStates.includes(nextState)) {
            throw ApiError.badRequest('Invalid lifecycle state');
        }

        const updated = await this.updateStatus(rideId, nextState, null);

        // Notify Passenger
        trackingService.broadcastRideUpdate(rideId, nextState.toLowerCase(), updated);

        return updated;
    }
}

export const transferService = new TransferService();
