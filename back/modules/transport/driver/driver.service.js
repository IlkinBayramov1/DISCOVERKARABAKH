import { driverRepository } from './driver.repository.js';
import prisma from '../../../config/db.js'; 
import { ApiError } from '../../../core/api.error.js';
import { createClient } from 'redis';
import { hashPassword } from '../../../utils/hash.util.js';
import crypto from 'crypto';

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
    async createDriverByVendor(vendorId, data) {
        const { email, password, firstName, lastName, phone, licenseNumber } = data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw ApiError.badRequest('Bu email ilə istifadəçi artıq mövcuddur.');

        const hashedPassword = await hashPassword(password || 'driver123456'); // Default password if not provided

        return await prisma.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    id: crypto.randomUUID(),
                    email,
                    password: hashedPassword,
                    role: 'driver',
                    firstName,
                    lastName,
                    phone,
                    isActive: true,
                    isApproved: true,
                    updatedAt: new Date()
                }
            });

            // 2. Create Driver Profile
            const driverProfile = await tx.driverprofile.create({
                data: {
                    id: crypto.randomUUID(),
                    userId: user.id,
                    managedById: vendorId,
                    firstName,
                    lastName,
                    phone,
                    licenseNumber,
                    status: 'Approved' // Vendor created drivers are approved by default
                }
            });

            return driverProfile;
        });
    }

    async registerDriver(userId, data) {
        const existing = await driverRepository.findByUserId(userId);
        if (existing) throw ApiError.badRequest('Driver profile already exists');

        const { driverType, ...driverData } = data;

        // Simply create Driver Profile (without a vehicle). 
        // Vehicle will be assigned later by Vendor Dashboard.
        return await driverRepository.create({
            userId,
            status: 'Pending',
            ...driverData
        });
    }

    async getMyProfile(userId) {
        const profile = await driverRepository.findByUserId(userId);
        if (!profile) throw ApiError.notFound('Driver profile not found');
        return profile;
    }

    async getTransportVendors() {
        // Find users with role 'vendor' and a vendorprofile with category 'transport'
        const vendors = await prisma.user.findMany({
            where: {
                role: 'vendor',
                isActive: true, // Only active vendors
                vendorprofile: {
                    category: 'transport'
                }
            },
            select: {
                id: true,
                email: true,
                vendorprofile: {
                    select: {
                        companyName: true
                    }
                }
            }
        });

        // Map to a simpler format for frontend dropdowns
        return vendors.map(v => ({
            id: v.id,
            email: v.email,
            companyName: v.vendorprofile?.companyName || v.email
        }));
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
            const d = await tx.driverprofile.update({
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

    async assignVehicle(driverId, vendorId, role, payload) {
        const driver = await driverRepository.findById(driverId);
        if (!driver) throw ApiError.notFound('Driver not found');

        if (role !== 'admin' && driver.managedById !== vendorId) {
            throw ApiError.forbidden('You cannot manage this driver');
        }

        const dataToUpdate = {};
        if (payload.vehicleId !== undefined) {
            dataToUpdate.currentVehicleId = payload.vehicleId;
            if (payload.vehicleId !== null) {
                dataToUpdate.currentCargoVehicleId = null;
            }
        }
        if (payload.cargoVehicleId !== undefined) {
            dataToUpdate.currentCargoVehicleId = payload.cargoVehicleId;
            if (payload.cargoVehicleId !== null) {
                dataToUpdate.currentVehicleId = null;
            }
        }

        const updatedDriver = await driverRepository.update(driverId, dataToUpdate);
        return updatedDriver;
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

    async getFleetLocations(vendorId) {
        // Find all drivers managed by this vendor
        const drivers = await driverRepository.findAll({ managedById: vendorId }, 0, 1000);
        
        if (!drivers || drivers.length === 0) return [];
        
        const mapped = drivers.map(d => ({
            driverId: d.id,
            firstName: d.firstName,
            lastName: d.lastName,
            status: d.status,
            location: null // default
        }));

        if (redisClient && redisClient.isOpen) {
            try {
                // Get coords from Redis active_drivers via GEOPOS
                const driverIds = mapped.map(d => d.driverId);
                const positions = await redisClient.geoPos('active_drivers', driverIds);
                
                positions.forEach((pos, idx) => {
                    if (pos) { // [longitude, latitude]
                        mapped[idx].location = {
                            lat: pos.latitude,
                            lng: pos.longitude
                        };
                    }
                });
            } catch (err) {
                console.error("Error reading GEOPOS for fleet map:", err);
            }
        }
        return mapped;
    }
}

export const driverService = new DriverService();
