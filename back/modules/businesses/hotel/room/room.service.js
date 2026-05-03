import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';
import { hotelEvents, ROOM_INVENTORY_DEPLETED, ROOM_TYPE_CREATED, ROOM_TYPE_UPDATED, ROOM_TYPE_DELETED } from '../hotel.events.js';

class RoomService {
    /**
     * Create a new RoomType footprint for a hotel.
     */
    async createRoomType(hotelId, vendorId, data) {
        // Validation: Verify vendor owns this hotel
        const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel) throw ApiError.notFound('Hotel not found');
        if (hotel.ownerId !== vendorId) {
            throw ApiError.forbidden('You do not own this hotel.');
        }

        const { images, amenities, basePrice, category, ...roomData } = data;

        const result = await prisma.roomType.create({
            data: {
                ...roomData,
                category: category || 'Standard',
                hotelId,
                basePrice: basePrice !== undefined && basePrice !== null ? parseFloat(basePrice) : undefined,
                images: images?.length ? {
                    create: images.map((url, index) => ({ url, order: index }))
                } : undefined,
                roomAmenities: amenities?.length ? {
                    create: amenities.map(item => ({
                        amenityName: typeof item === 'string' ? item : item.name,
                        category: typeof item === 'string' ? 'General' : (item.category || 'General')
                    }))
                } : undefined
            },
            include: { images: true, roomAmenities: true }
        });

        // 🟢 FIX: Handle basePrice by generating standard daily pricing for the next 30 days 
        // so the frontend can read the price smoothly.
        if (basePrice !== undefined && basePrice !== null) {
            const pricingData = [];
            const today = new Date();
            for (let i = 0; i < 30; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() + i);
                pricingData.push({
                    date: d,
                    basePrice: parseFloat(basePrice),
                    roomTypeId: result.id
                });
            }
            await prisma.dailyPricing.createMany({
                data: pricingData,
                skipDuplicates: true
            });
        }

        // Trigger snapshot update
        hotelEvents.emit(ROOM_TYPE_CREATED, { hotelId, roomType: result });

        return result;
    }

    /**
     * Fetches room types grouped by a Hotel
     */
    async getRoomsByHotel(hotelId, filters = {}) {
        const { adults, children, category, checkIn, checkOut } = filters;
        let whereClause = { hotelId };

        const checkInDate = checkIn ? new Date(checkIn + 'T00:00:00.000Z') : null;
        const checkOutDate = checkOut ? new Date(checkOut + 'T00:00:00.000Z') : null;

        if (adults) {
            whereClause.maxAdults = { gte: parseInt(adults) };
        }
        if (children) {
            whereClause.maxChildren = { gte: parseInt(children) };
        }
        if (category && category !== 'All Rooms') {
            whereClause.category = category.endsWith('s') ? category.slice(0, -1) : category;
        }

        const rooms = await prisma.roomType.findMany({
            where: whereClause,
            include: {
                images: true,
                roomAmenities: true,
                pricingList: {
                    where: checkInDate && checkOutDate ? {
                        date: {
                            gte: checkInDate,
                            lt: checkOutDate
                        }
                    } : {
                        date: { gte: new Date() }
                    },
                    orderBy: { date: 'asc' }
                }
            },
            orderBy: { name: 'asc' }
        });

        return rooms.map(room => {
            let basePrice = room.basePrice || 0;
            
            if (room.pricingList && room.pricingList.length > 0) {
                // If dates were provided, calculate average price for that period
                if (checkIn && checkOut) {
                    const sum = room.pricingList.reduce((acc, p) => acc + p.basePrice, 0);
                    basePrice = sum / room.pricingList.length;
                } else {
                    // Otherwise just take the first available price
                    basePrice = room.pricingList[0].basePrice;
                }
            }

            const { pricingList, ...rest } = room;
            return {
                ...rest,
                basePrice: Math.round(basePrice * 100) / 100
            };
        });
    }

    async getRoomById(hotelId, roomId, filters = {}) {
        const { checkIn, checkOut } = filters;
        
        const checkInDate = checkIn ? new Date(checkIn + 'T00:00:00.000Z') : null;
        const checkOutDate = checkOut ? new Date(checkOut + 'T00:00:00.000Z') : null;

        const room = await prisma.roomType.findFirst({
            where: { id: roomId, hotelId },
            include: {
                images: { orderBy: { order: 'asc' } },
                roomAmenities: true,
                hotel: {
                    select: {
                        name: true,
                        city: true,
                        address: true,
                        images: { take: 1, orderBy: { order: 'asc' } }
                    }
                },
                pricingList: {
                    where: checkInDate && checkOutDate ? {
                        date: {
                            gte: checkInDate,
                            lt: checkOutDate
                        }
                    } : {
                        date: { gte: new Date() }
                    },
                    orderBy: { date: 'asc' }
                }
            }
        });

        if (!room) throw ApiError.notFound('Room not found');

        let basePrice = room.basePrice || 0;
        if (room.pricingList && room.pricingList.length > 0) {
            if (checkIn && checkOut) {
                const sum = room.pricingList.reduce((acc, p) => acc + p.basePrice, 0);
                basePrice = sum / room.pricingList.length;
            } else {
                basePrice = room.pricingList[0].basePrice;
            }
        }

        const { pricingList, ...rest } = room;
        return {
            ...rest,
            basePrice: Math.round(basePrice * 100) / 100
        };
    }

    /**
     * Updates specific room type properties and adjusts inventory physical capacity.
     */
    async updateRoomType(hotelId, roomId, vendorId, data) {
        // Ownership cascading check
        const room = await prisma.roomType.findFirst({
            where: { id: roomId, hotelId },
            include: { hotel: true }
        });

        if (!room) throw ApiError.notFound('Room not found in this hotel');
        if (room.hotel.ownerId !== vendorId) throw ApiError.forbidden('Unauthorized');

        const { images, amenities, basePrice, category, ...roomData } = data;

        const updated = await prisma.roomType.update({
            where: { id: roomId },
            data: {
                ...roomData,
                category: category,
                basePrice: basePrice !== undefined && basePrice !== null ? parseFloat(basePrice) : undefined
            }
        });

        // 🟢 FIX: Update pricing and ensure it exists for the next 30 days
        if (basePrice !== undefined && basePrice !== null) {
            const parsedPrice = parseFloat(basePrice);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const endDate = new Date(today);
            endDate.setDate(today.getDate() + 30);

            // 1. Delete existing records for the range to avoid unique constraint issues
            await prisma.dailyPricing.deleteMany({
                where: {
                    roomTypeId: roomId,
                    date: {
                        gte: today,
                        lt: endDate
                    }
                }
            });

            // 2. Create fresh records for the next 30 days
            const pricingData = [];
            for (let i = 0; i < 30; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() + i);
                pricingData.push({
                    roomTypeId: roomId,
                    date: d,
                    basePrice: parsedPrice
                });
            }
            
            await prisma.dailyPricing.createMany({
                data: pricingData,
                skipDuplicates: true
            });
        }

        // Sync Images
        if (images !== undefined) {
            await prisma.roomImage.deleteMany({ where: { roomTypeId: roomId } });
            if (images.length > 0) {
                await prisma.roomImage.createMany({
                    data: images.map((url, index) => ({ roomTypeId: roomId, url, order: index }))
                });
            }
        }

        // Sync Amenities
        if (amenities !== undefined) {
            await prisma.roomAmenity.deleteMany({ where: { roomTypeId: roomId } });
            if (amenities.length > 0) {
                await prisma.roomAmenity.createMany({
                    data: amenities.map(item => ({
                        roomTypeId: roomId,
                        amenityName: typeof item === 'string' ? item : item.name,
                        category: typeof item === 'string' ? 'General' : (item.category || 'General')
                    }))
                });
            }
        }

        // Fetch complete object with relations
        const fullRoom = await prisma.roomType.findUnique({
            where: { id: roomId },
            include: { images: true, roomAmenities: true }
        });

        // Event trigger if we dropped inventory drastically
        if (fullRoom.totalInventory === 0) {
            hotelEvents.emit(ROOM_INVENTORY_DEPLETED, { hotelId, roomId });
        }

        // Trigger snapshot update
        hotelEvents.emit(ROOM_TYPE_UPDATED, { hotelId, roomId });

        return fullRoom;
    }

    async deleteRoomType(hotelId, roomId, vendorId) {
        const room = await prisma.roomType.findFirst({
            where: { id: roomId, hotelId },
            include: { hotel: true }
        });

        if (!room) throw ApiError.notFound('Room not found in this hotel');
        if (room.hotel.ownerId !== vendorId) throw ApiError.forbidden('Unauthorized');

        const result = await prisma.roomType.delete({ where: { id: roomId } });

        // Trigger snapshot update
        hotelEvents.emit(ROOM_TYPE_DELETED, { hotelId, roomId });

        return result;
    }

    // ============================================
    // Physical Room Management (101, 102, etc.)
    // ============================================

    async getPhysicalRooms(hotelId, vendorId, filters = {}) {
        const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel) throw ApiError.notFound('Hotel not found');
        if (hotel.ownerId !== vendorId) throw ApiError.forbidden('Unauthorized');

        const { status, roomTypeId, floor } = filters;

        return prisma.room.findMany({
            where: {
                roomType: { hotelId },
                ...(status && { status }),
                ...(roomTypeId && { roomTypeId }),
                ...(floor && { floor: floor.toString() })
            },
            include: { roomType: true },
            orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }]
        });
    }

    async createPhysicalRoom(hotelId, vendorId, data) {
        const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel) throw ApiError.notFound('Hotel not found');
        if (hotel.ownerId !== vendorId) throw ApiError.forbidden('Unauthorized');

        const { roomTypeId, roomNumber, floor } = data;

        // Verify roomType belongs to this hotel
        const rt = await prisma.roomType.findUnique({ where: { id: roomTypeId } });
        if (!rt || rt.hotelId !== hotelId) throw ApiError.badRequest('Invalid Room Type for this hotel');

        const result = await prisma.room.create({
            data: {
                roomNumber,
                floor,
                roomTypeId,
                status: 'AVAILABLE'
            }
        });

        // Trigger snapshot update
        hotelEvents.emit(AVAILABILITY_UPDATED, { hotelId });

        return result;
    }

    async updatePhysicalRoomStatus(hotelId, roomId, vendorId, data) {
        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: { roomType: { include: { hotel: true } } }
        });

        if (!room || room.roomType.hotelId !== hotelId) throw ApiError.notFound('Room not found');
        if (room.roomType.hotel.ownerId !== vendorId) throw ApiError.forbidden('Unauthorized');

        const updateData = { ...data };

        // Auto-update lastCleanedAt when marked as AVAILABLE
        if (data.status === 'AVAILABLE' && room.status !== 'AVAILABLE') {
            updateData.lastCleanedAt = new Date();
        }

        const result = await prisma.room.update({
            where: { id: roomId },
            data: updateData
        });

        // Trigger snapshot update
        hotelEvents.emit(AVAILABILITY_UPDATED, { hotelId });

        return result;
    }

    async deletePhysicalRoom(hotelId, roomId, vendorId) {
        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: { roomType: { include: { hotel: true } } }
        });

        if (!room || room.roomType.hotelId !== hotelId) throw ApiError.notFound('Room not found');
        if (room.roomType.hotel.ownerId !== vendorId) throw ApiError.forbidden('Unauthorized');

        const result = await prisma.room.delete({ where: { id: roomId } });

        // Trigger snapshot update
        hotelEvents.emit(AVAILABILITY_UPDATED, { hotelId });

        return result;
    }

    async createBulkPhysicalRooms(hotelId, vendorId, data) {
        const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel) throw ApiError.notFound('Hotel not found');
        if (hotel.ownerId !== vendorId) throw ApiError.forbidden('Unauthorized');

        const { roomTypeId, floor, startNumber, endNumber, prefix = '' } = data;

        // Verify roomType belongs to this hotel
        const rt = await prisma.roomType.findUnique({ where: { id: roomTypeId } });
        if (!rt || rt.hotelId !== hotelId) throw ApiError.badRequest('Invalid Room Type for this hotel');

        const roomsToCreate = [];
        for (let i = startNumber; i <= endNumber; i++) {
            roomsToCreate.push({
                roomNumber: `${prefix}${i}`,
                floor: floor?.toString() || null,
                roomTypeId: roomTypeId,
                status: 'AVAILABLE'
            });
        }

        if (roomsToCreate.length > 100) {
            throw ApiError.badRequest('Maximum 100 rooms can be created at once');
        }

        // Use createMany for high performance (MySQL supports skipDuplicates)
        const result = await prisma.room.createMany({
            data: roomsToCreate,
            skipDuplicates: true
        });

        // Trigger snapshot update
        hotelEvents.emit(AVAILABILITY_UPDATED, { hotelId });

        return result;
    }
}

export const roomService = new RoomService();
