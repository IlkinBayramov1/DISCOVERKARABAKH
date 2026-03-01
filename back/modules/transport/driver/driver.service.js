import { driverRepository } from './driver.repository.js';
import prisma from '../../../config/db.js'; // Need raw prisma for role update
import { ApiError } from '../../../core/api.error.js';
import { createClient } from 'redis';

let redisClient;
try {
    redisClient = createClient({
        socket: { reconnectStrategy: false }
    });
    redisClient.on('error', (err) => { /* Suppress error spam */ });
    redisClient.connect().catch(() => { });
} catch (e) {
    console.error("Redis connection failed to initialize in Driver Service");
}

class DriverService {
    async registerDriver(userId, data) {
        // Check if profile exists
        const existing = await driverRepository.findByUserId(userId);
        if (existing) throw ApiError.badRequest('Driver profile already exists');

        // Create profile
        // Status defaults to Pending
        return driverRepository.create({
            userId,
            ...data
        });
    }

    async getMyProfile(userId) {
        const profile = await driverRepository.findByUserId(userId);
        if (!profile) throw ApiError.notFound('Driver profile not found');
        return profile;
    }

    async getDrivers(userId, role, query) {
        let filter = { ...query };

        // Vendor sees own drivers
        if (role === 'vendor') {
            filter.managedById = userId;
        }
        // Admin sees all? Or can filter by managedBy.

        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        return driverRepository.findAll(filter, skip, limit);
    }

    async approveDriver(driverId, vendorId, role) {
        const driver = await driverRepository.findById(driverId);
        if (!driver) throw ApiError.notFound('Driver not found');

        // Only Admin or the Managing Vendor can approve logic?
        // If driver.managedById matches user.id

        if (role !== 'admin' && driver.managedById !== vendorId) {
            throw ApiError.forbidden('You cannot manage this driver');
        }

        // Update status AND update User Role to 'driver' if not already
        // Transaction
        const updated = await prisma.$transaction(async (tx) => {
            const d = await tx.driverProfile.update({
                where: { id: driverId },
                data: { status: 'Approved' } // or 'Offline' ready to work
            });

            // Update User Role to Driver so they can login to Driver App
            await tx.user.update({
                where: { id: driver.userId },
                data: { role: 'driver' }
            });

            return d;
        });

        return updated;
    }

    async updateStatus(driverId, userId, status, lat = null, lng = null) {
        // Driver updating own status (Online/Offline)
        const driver = await driverRepository.findByUserId(userId);
        if (!driver) throw ApiError.notFound('Profile not found');

        if (driver.id !== driverId) throw ApiError.forbidden('Mismatch ID');

        const updatedDriver = await driverRepository.update(driverId, { status });

        // Redis GEO Lifecycle Management
        if (redisClient && redisClient.isOpen) {
            try {
                if (status === 'Online' && lat && lng) {
                    // Add/Update driver in spatial index
                    await redisClient.geoAdd('active_drivers', {
                        longitude: parseFloat(lng),
                        latitude: parseFloat(lat),
                        member: driverId
                    });
                } else if (status === 'Offline' || status === 'Busy') {
                    // Remove from active tracking index
                    await redisClient.zRem('active_drivers', driverId);
                }
            } catch (err) {
                console.error("Redis GEO Error:", err);
            }
        }

        return updatedDriver;
    }

    /**
     * Advanced Redis GEOSEARCH implementation
     * Replaces deprecated GEORADIUS with the modern GEOSPATIAL API
     */
    async findNearestDrivers(lat, lng, radiusKm = 10, count = 5) {
        if (!redisClient || !redisClient.isOpen) {
            console.warn("Redis is unavailable, returning empty matching list.");
            return [];
        }

        try {
            // Redis 6.2+ GEOSEARCH command implementation
            // BYRADIUS syntax: GEOSEARCH key FROM LONLAT lon lat BYRADIUS radius km ASC WITHDIST WITHCOORD COUNT count
            const results = await redisClient.geoSearchWith(
                'active_drivers',
                { longitude: parseFloat(lng), latitude: parseFloat(lat) }, // FROM LONLAT
                { radius: radiusKm, unit: 'km' }, // BYRADIUS 
                ['WITHDIST', 'WITHCOORD'],
                { SORT: 'ASC', COUNT: count } // Nearest first
            );

            // Format results into a generic array of objects { driverId, distance, coords }
            return results.map(item => ({
                driverId: item.member,
                distanceKm: parseFloat(item.distance),
                lat: parseFloat(item.coordinates.latitude),
                lng: parseFloat(item.coordinates.longitude)
            }));
        } catch (error) {
            console.error("Redis GEOSEARCH Error:", error);
            return [];
        }
    }
}

export const driverService = new DriverService();
