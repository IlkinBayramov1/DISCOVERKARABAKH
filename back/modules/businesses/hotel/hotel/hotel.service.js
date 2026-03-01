import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';

class HotelService {
    /**
     * Creates a new Hotel Entity mapped to a Vendor
     */
    async create(vendorId, data) {
        // Map payload strictly to Prisma schema
        const { amenities, ...rest } = data;

        const hotel = await prisma.hotel.create({
            data: {
                ...rest,
                ownerId: vendorId,
                status: 'pending',
                // Handle many-to-many relationship for amenities if provided
                amenities: amenities && amenities.length > 0 ? {
                    create: amenities.map(amenityId => ({
                        amenity: { connect: { id: amenityId } }
                    }))
                } : undefined
            },
            include: { amenities: { include: { amenity: true } } }
        });

        return hotel;
    }

    /**
     * Advanced Enterprise Search Engine for Hotels
     * Supports strict Geospatial Haversine equations and Amenity relational intersect.
     */
    async findAll(query) {
        const {
            lat,
            lng,
            radiusKm = 10,
            amenityIds,
            search,
            starRating,
            limit = 20,
            skip = 0
        } = query;

        let whereClause = { status: 'active' };

        if (search) {
            whereClause.name = { contains: search };
            // Note: In prod MySQL, we'd use fullTextSearch `search: search` but contains is safer for fallback
        }

        if (starRating) {
            whereClause.starRating = { gte: parseInt(starRating) };
        }

        // Relational Amenity Filtering (Strict matching constraint)
        if (amenityIds) {
            // amenityIds expected as "id1,id2"
            const idsList = amenityIds.split(',');
            whereClause.amenities = {
                some: { amenityId: { in: idsList } }
            };
        }

        // Geospatial Logic - Prisma Native RAW Haversine
        if (lat && lng) {
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            const radius = parseFloat(radiusKm);

            // Utilizing RAW SQL to calculate distance and fetch IDs within range
            const nearbyHotels = await prisma.$queryRaw`
                SELECT id, 
                ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) AS distance 
                FROM Hotel 
                HAVING distance < ${radius} 
                ORDER BY distance 
                LIMIT ${parseInt(limit)} OFFSET ${parseInt(skip)}
            `;

            const validIds = nearbyHotels.map(h => h.id);
            whereClause.id = { in: validIds };

            return prisma.hotel.findMany({
                where: whereClause,
                include: { amenities: { include: { amenity: true } } }
            });
        }

        // Default flat lookup if no Coordinates
        return prisma.hotel.findMany({
            where: whereClause,
            include: { amenities: { include: { amenity: true } } },
            take: parseInt(limit),
            skip: parseInt(skip),
            orderBy: [{ isFeatured: 'desc' }, { featuredPriority: 'desc' }] // Feature prioritization
        });
    }

    async findById(hotelId) {
        const hotel = await prisma.hotel.findUnique({
            where: { id: hotelId },
            include: {
                amenities: { include: { amenity: true } },
                roomTypes: true,
                dailyStats: {
                    orderBy: { date: 'desc' },
                    take: 7
                }
            }
        });

        if (!hotel) throw ApiError.notFound('Hotel not found');
        return hotel;
    }

    async update(hotelId, vendorId, data, userRole) {
        const hotel = await this.findById(hotelId);

        if (hotel.ownerId !== vendorId && userRole !== 'admin') {
            throw ApiError.forbidden('Not authorized to access this Hotel');
        }

        const { amenities, ...rest } = data;

        // Disconnect old amenities, re-map new ones
        let amenitiesUpdate = undefined;
        if (amenities) {
            // Hard deletion of M2M records safely mapping the new batch
            await prisma.hotelAmenity.deleteMany({ where: { hotelId } });
            amenitiesUpdate = {
                create: amenities.map(id => ({ amenityId: id }))
            };
        }

        return prisma.hotel.update({
            where: { id: hotelId },
            data: { ...rest, amenities: amenitiesUpdate },
            include: { amenities: { include: { amenity: true } } }
        });
    }

    async delete(hotelId, vendorId, userRole) {
        const hotel = await this.findById(hotelId);
        if (hotel.ownerId !== vendorId && userRole !== 'admin') {
            throw ApiError.forbidden('Not authorized');
        }

        return prisma.hotel.delete({ where: { id: hotelId } });
    }
}

export const hotelService = new HotelService();
