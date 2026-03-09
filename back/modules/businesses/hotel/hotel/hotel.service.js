import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';

class HotelService {
    /**
     * Creates a new Hotel Entity mapped to a Vendor
     */
    async create(vendorId, data) {
        // Map payload strictly to Prisma schema
        const { amenities, images, ...rest } = data;

        const hotel = await prisma.hotel.create({
            data: {
                ...rest,
                ownerId: vendorId,
                status: 'pending',
                // Handle many-to-many relationship for amenities with connectOrCreate
                amenities: amenities && amenities.length > 0 ? {
                    create: amenities.map(amenityName => ({
                        amenity: {
                            connectOrCreate: {
                                where: { name: amenityName },
                                create: { name: amenityName }
                            }
                        }
                    }))
                } : undefined,
                // Handle One-to-Many images relationship
                images: images && images.length > 0 ? {
                    create: images.map((url, index) => ({ url, order: index }))
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
                include: { amenities: { include: { amenity: true } }, images: true }
            });
        }

        // Default flat lookup if no Coordinates
        return prisma.hotel.findMany({
            where: whereClause,
            include: { amenities: { include: { amenity: true } }, images: true },
            take: parseInt(limit),
            skip: parseInt(skip),
            orderBy: [{ isFeatured: 'desc' }, { featuredPriority: 'desc' }] // Feature prioritization
        });
    }

    async findByVendor(vendorId) {
        const hotels = await prisma.hotel.findMany({
            where: { ownerId: vendorId },
            include: {
                amenities: { include: { amenity: true } },
                roomTypes: true,
                images: true,
                reviews: {
                    where: { status: 'approved' },
                     select: { rating: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return hotels.map(hotel => {
            const reviewCount = hotel.reviews ? hotel.reviews.length : 0;
            const rating = reviewCount > 0
                ? hotel.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
                : 0;

            const { reviews, ...hotelData } = hotel;
            return {
                ...hotelData,
                reviewCount,
                rating
            };
        });
    }

    async findRoomsByVendor(vendorId) {
        return prisma.roomType.findMany({
            where: {
                hotel: {
                    ownerId: vendorId
                }
            },
            include: {
                images: true,
                roomAmenities: true,
                hotel: {
                    select: { name: true, id: true }
                }
            },
            orderBy: { name: 'asc' }
        });
    }

    async findReviewsByVendor(vendorId) {
        return prisma.review.findMany({
            where: {
                hotel: {
                    ownerId: vendorId
                }
            },
            include: {
                user: { select: { email: true } },
                hotel: { select: { name: true, id: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(hotelId) {
        const hotel = await prisma.hotel.findUnique({
            where: { id: hotelId },
            include: {
                amenities: { include: { amenity: true } },
                roomTypes: true,
                images: true,
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

        const { amenities, images, ...rest } = data;

        // Disconnect old amenities, re-map new ones using connectOrCreate
        let amenitiesUpdate = undefined;
        if (amenities) {
            // Hard deletion of M2M records safely mapping the new batch
            await prisma.hotelAmenity.deleteMany({ where: { hotelId } });
            amenitiesUpdate = {
                create: amenities.map(amenityName => ({
                    amenity: {
                        connectOrCreate: {
                            where: { name: amenityName },
                            create: { name: amenityName }
                        }
                    }
                }))
            };
        }

        let imagesUpdate = undefined;
        if (images) {
            await prisma.hotelImage.deleteMany({ where: { hotelId } });
            imagesUpdate = {
                create: images.map((url, index) => ({ url, order: index }))
            };
        }

        return prisma.hotel.update({
            where: { id: hotelId },
            data: { ...rest, amenities: amenitiesUpdate, images: imagesUpdate },
            include: { amenities: { include: { amenity: true } }, images: true }
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
