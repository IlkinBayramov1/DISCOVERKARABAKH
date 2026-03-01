import prisma from '../../../../config/db.js';

class TransferRepository {
    async create(data) {
        return prisma.ride.create({
            data,
            include: {
                passenger: { select: { email: true, phone: true } },
                driver: { select: { firstName: true, lastName: true, phone: true } },
                vehicle: true
            }
        });
    }

    async findById(id) {
        return prisma.ride.findUnique({
            where: { id },
            include: {
                passenger: { select: { email: true, phone: true } },
                driver: { select: { firstName: true, lastName: true, phone: true, currentLocation: true } },
                vehicle: true,
                pricingRule: true
            }
        });
    }

    async findAll(filter = {}, skip = 0, take = 10) {
        const where = {};
        if (filter.status) where.status = filter.status;
        if (filter.passengerId) where.passengerId = filter.passengerId;
        if (filter.driverId) where.driverId = filter.driverId;

        const count = await prisma.ride.count({ where });
        const rides = await prisma.ride.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                passenger: { select: { email: true } },
                driver: { select: { firstName: true, lastName: true } },
                vehicle: { select: { brand: true, model: true, plateNumber: true } }
            }
        });

        return { count, rides };
    }

    async update(id, data) {
        return prisma.ride.update({
            where: { id },
            data,
            include: {
                passenger: true,
                driver: true
            }
        });
    }

    async findNearbyDrivers(lat, lng, radiusKm = 10) {
        // Geo-spatial query for drivers.
        // Prisma doesn't support native GIS in a simple way for all DBs.
        // For Mock/MVP: return all 'Online' drivers and filter in Service (inefficient but works for small scale)
        // OR raw query.
        // Let's return all active online drivers for now.
        return prisma.driverProfile.findMany({
            where: { status: 'Online' },
            include: { currentVehicle: true }
        });
    }
}

export const transferRepository = new TransferRepository();
