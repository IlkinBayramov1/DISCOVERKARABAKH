import { transferRepository } from './transfer.repository.js';
import { ApiError } from '../../../../core/api.error.js';
import prisma from '../../../../config/db.js';
import { createClient } from 'redis';
import crypto from 'crypto';
import { calculateDistance } from '../../../../core/utils/distance.util.js';

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
    REQUESTED: 'REQUESTED',
    MATCHING: 'MATCHING',
    DRIVER_ASSIGNED: 'DRIVER_ASSIGNED',
    DRIVER_ACCEPTED: 'DRIVER_ACCEPTED',
    ARRIVED: 'ARRIVED',
    STARTED: 'STARTED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

class TransferService {
    async createTransfer(userId, data) {
        let { pickupLocation, dropoffLocation, distanceKm, durationMin, vehicleCategory } = data;

        // Fallback Haversine Calculation if DistanceKm is not provided by Frontend OSRM Router
        if (!distanceKm && pickupLocation && dropoffLocation) {
            distanceKm = calculateDistance(
                pickupLocation.lat, pickupLocation.lng,
                dropoffLocation.lat, dropoffLocation.lng
            );
        }

        const basePrice = 5;
        const ratePerKm = 1.5;
        let price = basePrice + ((distanceKm || 0) * ratePerKm);

        // Surge Pricing Core Logic (mock multiplier mapped for standard demand)
        let demandMultiplier = 1.0;
        if (redisClient && redisClient.isOpen) {
            // Future enhancement: Fetch active_drivers count vs rides within radius 
            // to dynamically push demandMultiplier up (e.g., 1.5x, 2.0x).
        }
        price = parseFloat((price * demandMultiplier).toFixed(2));

        // Generate Idempotency Key to prevent duplicate queue submissions
        const idempotencyKey = crypto.randomUUID();

        // Initialize ride securely
        const ride = await transferRepository.create({
            passengerId: userId,
            pickupLocation: pickupLocation,
            dropoffLocation: dropoffLocation,
            distanceKm: distanceKm,
            durationMin: durationMin,
            price: data.price || price,
            status: RIDE_STATES.REQUESTED
        });

        // Event Payload intended for Message Queues (BullMQ/RabbitMQ)
        const dispatchEvent = {
            eventId: `dispatch-${ride.id}`,
            idempotencyKey,
            rideId: ride.id,
            pickupLocation,
            requiredCategory: vehicleCategory,
            timestamp: new Date().toISOString()
        };

        // Note: For actual Production, we push this payload to a Queue layer.
        console.log(`[Queue Stub] Triggered Ride ${ride.id}. Emitting dispatch payload:`, dispatchEvent);

        return ride;
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

    async updateStatus(id, status, userId) {
        // Validation logic: only driver or admin can change status?
        const transfer = await this.getTransferById(id);

        // STATE MACHINE GUARDS to prevent race conditions during lifecycle transitions
        const validTransitions = {
            [RIDE_STATES.REQUESTED]: [RIDE_STATES.MATCHING, RIDE_STATES.CANCELLED],
            [RIDE_STATES.MATCHING]: [RIDE_STATES.DRIVER_ASSIGNED, RIDE_STATES.CANCELLED],
            [RIDE_STATES.DRIVER_ASSIGNED]: [RIDE_STATES.DRIVER_ACCEPTED, RIDE_STATES.MATCHING, RIDE_STATES.CANCELLED], // MATCHING if driver rejects
            [RIDE_STATES.DRIVER_ACCEPTED]: [RIDE_STATES.ARRIVED, RIDE_STATES.CANCELLED],
            [RIDE_STATES.ARRIVED]: [RIDE_STATES.STARTED, RIDE_STATES.CANCELLED],
            [RIDE_STATES.STARTED]: [RIDE_STATES.COMPLETED],
            [RIDE_STATES.COMPLETED]: [],
            [RIDE_STATES.CANCELLED]: []
        };

        if (!validTransitions[transfer.status] || !validTransitions[transfer.status].includes(status)) {
            throw ApiError.badRequest(`Invalid state transition from ${transfer.status} to ${status}`);
        }

        return transferRepository.update(id, { status });
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

            // QUEUE DRIVER TIMEOUT (Reassignment Stub)
            // In a message queue like BullMQ, we add a delayed job here:
            // await reassignQueue.add('check-accept', { rideId, driverId }, { delay: 15000 });

            return updatedRide;
        } finally {
            // Release the Mutex Lock
            await redisClient.del(lockKey);
        }
    }
}

export const transferService = new TransferService();
