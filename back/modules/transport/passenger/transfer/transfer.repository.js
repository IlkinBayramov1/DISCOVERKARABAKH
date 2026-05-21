import prisma from '../../../../config/db.js';

class TransferRepository {
    _parseRide(ride) {
        if (!ride) return ride;
        const parsedRide = { ...ride };
        
        // Map user to passenger for vendor frontend
        if (ride.user) {
            parsedRide.passenger = {
                firstName: ride.user.firstName || 'Client',
                lastName: ride.user.lastName || '',
                email: ride.user.email || 'N/A',
                phone: ride.user.phone || 'N/A'
            };
        } else {
            parsedRide.passenger = { firstName: 'Client', lastName: '', email: 'N/A', phone: 'N/A' };
        }

        try {
            parsedRide.pickupLocation = typeof ride.pickupLocation === 'string' ? JSON.parse(ride.pickupLocation) : ride.pickupLocation;
        } catch (e) {
            parsedRide.pickupLocation = { address: ride.pickupLocation || 'Unknown Point' };
        }

        try {
            parsedRide.dropoffLocation = typeof ride.dropoffLocation === 'string' ? JSON.parse(ride.dropoffLocation) : ride.dropoffLocation;
        } catch (e) {
            parsedRide.dropoffLocation = { address: ride.dropoffLocation || 'Unknown Point' };
        }

        return parsedRide;
    }

    async create(data) {
        return prisma.ride.create({
            data,
            include: {
                user: { select: { email: true, phone: true } },
                driverprofile: { select: { firstName: true, lastName: true, phone: true } },
                vehicle: true
            }
        });
    }

    async findById(id) {
        const ride = await prisma.ride.findUnique({
            where: { id },
            include: {
                user: { select: { email: true, phone: true, firstName: true, lastName: true } },
                driverprofile: { select: { firstName: true, lastName: true, phone: true, currentLocation: true } },
                vehicle: true,
                ridepricing: true
            }
        });

        if (ride && ride.bookingNumber) {
            const booking = await prisma.booking.findUnique({
                where: { bookingNumber: ride.bookingNumber },
                include: { bookingitem: true }
            });
            if (booking && booking.bookingitem && booking.bookingitem.length > 0) {
                const item = booking.bookingitem[0];
                return this._parseRide({
                    ...ride,
                    paxCount: (item.adults || 0) + (item.children || 0)
                });
            }
        }

        return this._parseRide(ride);
    }

    async findAll(filter = {}, skip = 0, take = 10) {
        const where = {};
        if (filter.status) where.status = filter.status;
        if (filter.passengerId) where.passengerId = filter.passengerId;
        if (filter.driverId) where.driverId = filter.driverId;
        
        // Security filter for vendors to only see their own drivers' or vehicles' rides
        if (filter.vendorId) {
            where.OR = [
                { driverprofile: { managedById: filter.vendorId } },
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
                user: { select: { email: true, firstName: true, lastName: true, phone: true } },
                driverprofile: { select: { firstName: true, lastName: true } },
                vehicle: { select: { brand: true, model: true, plateNumber: true } }
            }
        });

        // Enhance rides with actual passenger count from Booking records
        const enhancedRides = await Promise.all(rides.map(async (ride) => {
            let paxCount = ride.paxCount || 1;
            
            if (ride.bookingNumber) {
                const booking = await prisma.booking.findUnique({
                    where: { bookingNumber: ride.bookingNumber },
                    include: { bookingitem: true }
                });
                if (booking && booking.bookingitem && booking.bookingitem.length > 0) {
                    const item = booking.bookingitem[0];
                    paxCount = (item.adults || 0) + (item.children || 0);
                }
            }

            // Explicitly map passenger data for frontend consistency
            const result = this._parseRide({ ...ride, paxCount });
            
            // Log for debugging (will show in server console)
            console.log(`[TransferRepoDebug] Ride ${ride.id}: Passenger: ${result.passenger?.firstName}, Pickup: ${result.pickupLocation?.address}`);
            
            return result;
        }));

        return { count, rides: enhancedRides };
    }

    async update(id, data) {
        return prisma.ride.update({
            where: { id },
            data,
            include: {
                user: true,
                driverprofile: true
            }
        });
    }

    async findNearbyDrivers(lat, lng, radiusKm = 10) {
        // Geo-spatial query for drivers.
        // Prisma doesn't support native GIS in a simple way for all DBs.
        // For Mock/MVP: return all 'Online' drivers and filter in Service (inefficient but works for small scale)
        // OR raw query.
        // Let's return all active online drivers for now.
        return prisma.driverprofile.findMany({
            where: { status: 'Online' },
            include: { vehicle: true }
        });
    }
}

export const transferRepository = new TransferRepository();
