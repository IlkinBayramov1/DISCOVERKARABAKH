import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';
import { hotelMapper } from './hotel.mapper.js';
import crypto from 'crypto';

class HotelService {
    /**
     * Creates a new Hotel Entity mapped to a Vendor
     */
    async create(vendorId, data) {
        // Check for existing property - Limit: 1 per vendor
        const existing = await prisma.hotel.findFirst({ where: { ownerId: vendorId } });
        if (existing) {
            throw ApiError.badRequest('You already have a registered hotel. Each vendor is limited to one property.');
        }

        // Map payload strictly to Prisma schema
        const { amenities, images, nearbyPOIs, ...rest } = data;

        const hotel = await prisma.hotel.create({
            data: {
                ...rest,
                ownerId: vendorId,
                status: 'active',
                // Handle many-to-many relationship for amenities
                hotelamenity: amenities && amenities.length > 0 ? {
                    create: amenities.map(amenityName => ({
                        amenity: {
                            connectOrCreate: {
                                where: { name: amenityName },
                                create: { name: amenityName }
                            }
                        }
                    }))
                } : undefined,
                // Handle Nearby POIs
                hotelpoi: nearbyPOIs && nearbyPOIs.length > 0 ? {
                    create: nearbyPOIs.map(poi => ({
                        attractionId: poi.attractionId,
                        distance: poi.distance,
                        description: poi.description,
                        order: poi.order || 0
                    }))
                } : undefined,
                // Handle One-to-Many images relationship
                hotelimage: images && images.length > 0 ? {
                    create: images.map((url, index) => ({ id: crypto.randomUUID(), url, order: index }))
                } : undefined
            },
            include: {
                hotelamenity: { include: { amenity: true } },
                hotelimage: true,
                review: true,
                roomtype: { include: { dailypricing: true } }
            }
        });

        return hotelMapper.toHotelDTO(hotel);
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
            amenityNames, // e.g. "Free WiFi,Pool"
            search,
            q, // alias for search
            adults,
            children,
            rooms,
            starRating,
            city,
            minPrice,
            maxPrice,
            minRating,
            checkIn,  // YYYY-MM-DD
            checkOut, // YYYY-MM-DD
            sortBy, // "price_asc", "price_desc", "rating_desc", "recommended"
            limit = 20,
            skip = 0
        } = query;

        let totalNights = 0;
        let start = null;
        let end = null;

        if (checkIn && checkOut) {
            start = new Date(checkIn);
            end = new Date(checkOut);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
                totalNights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            }
        }

        let availableRoomTypeIds = null;
        if (totalNights > 0) {
            // Find all RoomTypes that have EXACTLY 'totalNights' available days in the range
            // This ensures no missing dates and no fully booked/stopped dates.

            const roomTypesWithAvailability = await prisma.roomAvailability.groupBy({
                by: ['roomTypeId'],
                where: {
                    date: { gte: start, lt: end },
                    availableRooms: { gt: 0 }
                },
                _count: { roomTypeId: true },
                having: {
                    roomTypeId: {
                        _count: { equals: totalNights }
                    }
                }
            });

            const availIds = roomTypesWithAvailability.map(r => r.roomTypeId);

            const roomTypesWithPricing = await prisma.dailyPricing.groupBy({
                by: ['roomTypeId'],
                where: {
                    roomTypeId: { in: availIds },
                    date: { gte: start, lt: end },
                    isStopped: false
                },
                _count: { roomTypeId: true },
                having: {
                    roomTypeId: {
                        _count: { equals: totalNights }
                    }
                }
            });

            availableRoomTypeIds = roomTypesWithPricing.map(r => r.roomTypeId);
        }

        let whereClause = { status: 'active' };

        if (availableRoomTypeIds !== null) {
            whereClause.roomtype = {
                some: {
                    id: { in: availableRoomTypeIds }
                }
            };
        }

        const effectiveSearch = (search || q || "").trim();
        if (effectiveSearch) {
            whereClause.OR = [
                { name: { contains: effectiveSearch } },
                { description: { contains: effectiveSearch } }
            ];
        }

        // Occupancy filtering (Find hotels that have at least one room capable of hosting the requested count)
        if (adults || children) {
            const occupancyFilter = {
                maxAdults: { gte: parseInt(adults) || 1 },
                maxChildren: { gte: parseInt(children) || 0 }
            };

            if (whereClause.roomtype?.some) {
                // Merge with existing availability filter if present
                whereClause.roomtype.some = {
                    ...whereClause.roomtype.some,
                    ...occupancyFilter
                };
            } else {
                whereClause.roomtype = { some: occupancyFilter };
            }
        }

        if (starRating) {
            whereClause.starRating = { gte: parseInt(starRating) };
        }

        if (city) {
            whereClause.city = city;
        }

        // Relational Amenity Filtering by Name (Require ALL selected)
        if (amenityNames) {
            const namesList = amenityNames.split(',').map(n => n.trim());
            whereClause.AND = [
                ...(whereClause.AND || []),
                ...namesList.map(name => ({
                    hotelamenity: { some: { amenity: { name } } }
                }))
            ];
        }

        // Price Range Filtering (via RoomTypes -> DailyPricing)
        if (minPrice || maxPrice) {
            whereClause.roomtype = {
                some: {
                    pricingList: {
                        some: {
                            basePrice: {
                                ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
                                ...(maxPrice ? { lte: parseFloat(maxPrice) } : {})
                            }
                        }
                    }
                }
            };
        }

        const includeRelations = {
            hotelamenity: { include: { amenity: true } },
            hotelimage: true,
            roomtype: {
                include: {
                    pricingList: { orderBy: { basePrice: 'asc' }, take: 1 }
                }
            },
            review: { where: { status: 'approved' }, select: { rating: true } }
        };

        // Determine Prisma OrderBy (if standard)
        let prismaOrderBy = [{ isFeatured: 'desc' }, { featuredPriority: 'desc' }];

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
        }

        // Default flat lookup (or filtered by Geolocation IDs)
        const hotels = await prisma.hotel.findMany({
            where: whereClause,
            include: includeRelations,
            take: parseInt(limit),
            skip: parseInt(skip),
            orderBy: prismaOrderBy
        });

        const processed = hotels.map(h => hotelMapper.toHotelDTO(h));

        // Complex In-memory Sorting
        if (sortBy === 'price_asc') {
            processed.sort((a, b) => a.startingPrice - b.startingPrice);
        } else if (sortBy === 'price_desc') {
            processed.sort((a, b) => b.startingPrice - a.startingPrice);
        } else if (sortBy === 'rating_desc') {
            processed.sort((a, b) => b.rating - a.rating);
        }

        return processed;
    }


    async findByVendor(vendorId) {
        const hotels = await prisma.hotel.findMany({
            where: { ownerId: vendorId },
            include: {
                hotelamenity: { include: { amenity: true } },
                roomtype: true,
                hotelimage: true,
                review: {
                    where: { status: 'approved' },
                    select: { rating: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return hotels.map(hotel => hotelMapper.toHotelDTO(hotel));
    }

    async findRoomsByVendor(vendorId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const rooms = await prisma.roomtype.findMany({
            where: {
                hotel: {
                    ownerId: vendorId
                }
            },
            include: {
                roomimage: true,
                roomamenity: true,
                hotel: {
                    select: { name: true, id: true }
                },
                dailypricing: {
                    where: { date: { gte: today } },
                    orderBy: { date: 'asc' },
                    take: 1
                }
            },
            orderBy: { name: 'asc' }
        });

        return rooms.map(room => {
            const currentPrice = room.dailypricing && room.dailypricing.length > 0
                ? room.dailypricing[0].basePrice
                : (room.basePrice || null);

            const { dailypricing, roomimage, roomamenity, ...rest } = room;
            return {
                ...rest,
                basePrice: currentPrice,
                images: roomimage,
                amenities: roomamenity
            };
        });
    }

    async findReviewsByVendor(vendorId) {
        const [hotelReviews, roomReviews] = await Promise.all([
            prisma.review.findMany({
                where: {
                    hotel: { ownerId: vendorId }
                },
                include: {
                    user: { select: { email: true, firstName: true, lastName: true } },
                    hotel: { select: { name: true, id: true } }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.roomreview.findMany({
                where: {
                    roomtype: {
                        hotel: { ownerId: vendorId }
                    }
                },
                include: {
                    user: { select: { email: true, firstName: true, lastName: true } },
                    roomtype: {
                        include: {
                            hotel: { select: { name: true, id: true } }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        // Standardize both types into a common format for the UI
        const combined = [
            ...hotelReviews.map(r => ({ ...r, type: 'general' })),
            ...roomReviews.map(r => ({
                ...r,
                type: 'room',
                hotel: r.roomtype.hotel,
                roomType: { id: r.roomtype.id, name: r.roomtype.name }
            }))
        ];

        return combined.sort((a, b) => b.createdAt - a.createdAt);
    }

    async findById(hotelId) {
        const hotel = await prisma.hotel.findUnique({
            where: { id: hotelId },
            include: {
                hotelamenity: { include: { amenity: true } },
                roomtype: {
                    include: {
                        roomimage: true,
                        roomamenity: true,
                        dailypricing: {
                            orderBy: { basePrice: 'asc' },
                            take: 1
                        }
                    }
                },
                hotelimage: true,
                hoteldailystat: {
                    orderBy: { date: 'desc' },
                    take: 7
                },
                hotelpoi: {
                    include: {
                        attraction: {
                            select: {
                                id: true,
                                name: true,
                                latitude: true,
                                longitude: true,
                                attractionimage: { take: 1 }
                            }
                        }
                    },
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!hotel) throw ApiError.notFound('Hotel not found');

        return hotelMapper.toHotelDTO(hotel);
    }

    async update(hotelId, vendorId, data, userRole) {
        // We fetch raw record to perform ownership check before it gets stripped by DTO mapping
        const rawHotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
        if (!rawHotel) throw ApiError.notFound('Hotel not found');

        if (rawHotel.ownerId !== vendorId && userRole !== 'admin') {
            throw ApiError.forbidden('Not authorized to access this Hotel');
        }

        const { amenities, images, nearbyPOIs, ...rest } = data;

        // Disconnect old amenities, re-map new ones using connectOrCreate
        let amenitiesUpdate = undefined;
        if (amenities) {
            // Hard deletion of M2M records safely mapping the new batch
            await prisma.hotelamenity.deleteMany({ where: { hotelId } });
            amenitiesUpdate = {
                create: amenities.map(amenityName => ({
                    id: crypto.randomUUID(),
                    amenity: {
                        connectOrCreate: {
                            where: { name: amenityName },
                            create: { id: crypto.randomUUID(), name: amenityName }
                        }
                    }
                }))
            };
        }

        // Handle Nearby POIs Update
        let poiUpdate = undefined;
        if (nearbyPOIs) {
            await prisma.hotelpoi.deleteMany({ where: { hotelId } });
            poiUpdate = {
                create: nearbyPOIs.map(poi => ({
                    id: crypto.randomUUID(),
                    attractionId: poi.attractionId,
                    distance: poi.distance,
                    description: poi.description,
                    order: poi.order || 0
                }))
            };
        }

        let imagesUpdate = undefined;
        if (images) {
            await prisma.hotelimage.deleteMany({ where: { hotelId } });
            imagesUpdate = {
                create: images.map((url, index) => ({ id: crypto.randomUUID(), url, order: index }))
            };
        }

        const updated = await prisma.hotel.update({
            where: { id: hotelId },
            data: {
                ...rest,
                updatedAt: new Date(),
                hotelamenity: amenitiesUpdate,
                hotelimage: imagesUpdate,
                hotelpoi: poiUpdate
            },
            include: {
                hotelamenity: { include: { amenity: true } },
                roomtype: {
                    include: {
                        roomimage: true,
                        roomamenity: true,
                        dailypricing: {
                            orderBy: { basePrice: 'asc' },
                            take: 1
                        }
                    }
                },
                hotelimage: true,
                hoteldailystat: {
                    orderBy: { date: 'desc' },
                    take: 7
                },
                hotelpoi: {
                    include: {
                        attraction: {
                            select: {
                                id: true,
                                name: true,
                                latitude: true,
                                longitude: true,
                                attractionimage: { take: 1 }
                            }
                        }
                    },
                    orderBy: { order: 'asc' }
                }
            }
        });

        return hotelMapper.toHotelDTO(updated);
    }

    async delete(hotelId, vendorId, userRole) {
        const rawHotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
        if (!rawHotel) throw ApiError.notFound('Hotel not found');

        if (rawHotel.ownerId !== vendorId && userRole !== 'admin') {
            throw ApiError.forbidden('Not authorized');
        }

        return prisma.hotel.delete({ where: { id: hotelId } });
    }

    async getAnalytics(vendorId, query) {
        const { startDate, endDate } = query;
        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();

        // 1. Overall Stats - Revenue and confirmed booking count
        const stats = await prisma.booking.aggregate({
            where: {
                vendorId,
                bookingType: 'hotel',
                status: { in: ['confirmed', 'completed'] },
                createdAt: { gte: start, lte: end }
            },
            _sum: { totalPrice: true },
            _count: { id: true }
        });

        // 2. Cancellation Stats - Insight into lost business
        const cancellations = await prisma.booking.count({
            where: {
                vendorId,
                bookingType: 'hotel',
                status: 'cancelled',
                createdAt: { gte: start, lte: end }
            }
        });

        // 3. Daily Revenue Trend - For chart visualization
        const rawRevenueTrend = await prisma.booking.groupBy({
            by: ['createdAt'],
            where: {
                vendorId,
                status: { in: ['confirmed', 'completed'] },
                createdAt: { gte: start, lte: end }
            },
            _sum: { totalPrice: true },
            orderBy: { createdAt: 'asc' }
        });

        // 4. Occupancy Rate - Core KPI for hospitality
        const occupancyData = await prisma.roomAvailability.aggregate({
            where: {
                roomType: { hotel: { ownerId: vendorId } },
                date: { gte: start, lte: end }
            },
            _avg: {
                availableRooms: true,
                totalRooms: true
            }
        });

        const totalRoomsAvg = occupancyData._avg.totalRooms || 0;
        const availableRoomsAvg = occupancyData._avg.availableRooms || 0;
        const occupancyRate = totalRoomsAvg > 0
            ? ((totalRoomsAvg - availableRoomsAvg) / totalRoomsAvg) * 100
            : 0;

        return {
            summary: {
                totalRevenue: stats._sum.totalPrice || 0,
                bookingCount: stats._count.id || 0,
                cancellationCount: cancellations,
                occupancyRate: Math.round(occupancyRate * 10) / 10
            },
            trends: {
                revenue: rawRevenueTrend.map(t => ({
                    date: t.createdAt.toISOString().split('T')[0],
                    amount: t._sum.totalPrice
                }))
            }
        };
    }
}

export const hotelService = new HotelService();
