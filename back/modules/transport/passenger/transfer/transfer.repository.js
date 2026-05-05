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
        const ride = await prisma.ride.findUnique({
            where: { id },
            include: {
                passenger: { select: { email: true, phone: true, firstName: true, lastName: true } },
                driver: { select: { firstName: true, lastName: true, phone: true, currentLocation: true } },
                vehicle: true,
                pricingRule: true
            }
        });

        if (ride && ride.bookingNumber) {
            const booking = await prisma.booking.findUnique({
                where: { bookingNumber: ride.bookingNumber },
                include: { items: true }
            });
            if (booking && booking.items && booking.items.length > 0) {
                const item = booking.items[0];
                return {
                    ...ride,
                    paxCount: (item.adults || 0) + (item.children || 0)
                };
            }
        }

        return ride;
    }

    async findAll(filter = {}, skip = 0, take = 10) {
        const where = {};
        if (filter.status) where.status = filter.status;
        if (filter.passengerId) where.passengerId = filter.passengerId;
        if (filter.driverId) where.driverId = filter.driverId;
        
        // Security filter for vendors to only see their own drivers' or vehicles' rides
        if (filter.vendorId) {
            where.OR = [
                { driver: { managedById: filter.vendorId } },
                { vehicle: { vendorId: filter.vendorId } }
            ];
        }

        const count = await prisma.ride.count({ where });
        const rides = await prisma.ride.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                passenger: { select: { email: true, firstName: true, lastName: true, phone: true } },
                driver: { select: { firstName: true, lastName: true } },
                vehicle: { select: { brand: true, model: true, plateNumber: true } }
            }
        });

        // Enhance rides with actual passenger count from Booking records
        const enhancedRides = await Promise.all(rides.map(async (ride) => {
            if (ride.bookingNumber) {
                const booking = await prisma.booking.findUnique({
                    where: { bookingNumber: ride.bookingNumber },
                    include: { items: true }
                });
                if (booking && booking.items && booking.items.length > 0) {
                    const item = booking.items[0];
                    return {
                        ...ride,
                        paxCount: (item.adults || 0) + (item.children || 0)
                    };
                }
            }
            // Fallback to ride.paxCount if it exists (for new records if migration ever works) or 1
            return { ...ride, paxCount: ride.paxCount || 1 };
        }));

        return { count, rides: enhancedRides };
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
