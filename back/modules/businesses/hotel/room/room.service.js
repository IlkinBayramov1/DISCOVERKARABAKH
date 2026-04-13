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

        const { images, amenities, ...roomData } = data;

        return prisma.roomType.create({
            data: {
                ...roomData,
                hotelId,
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

        // Trigger snapshot update
        hotelEvents.emit(ROOM_TYPE_CREATED, { hotelId, roomType: result });

        return result;
    }

    /**
     * Fetches room types grouped by a Hotel
     */
    async getRoomsByHotel(hotelId) {
        const rooms = await prisma.roomType.findMany({
            where: { hotelId },
            include: { 
                images: true, 
                roomAmenities: true,
                pricingList: {
                    orderBy: { basePrice: 'asc' },
                    take: 1
                }
            },
            orderBy: { name: 'asc' }
        });

        return rooms.map(room => {
            const basePrice = room.pricingList && room.pricingList.length > 0 
                ? room.pricingList[0].basePrice 
                : null;
            
            const { pricingList, ...rest } = room;
            return {
                ...rest,
                basePrice
            };
        });
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

        const { images, amenities, ...roomData } = data;

        const updated = await prisma.roomType.update({
            where: { id: roomId },
            data: roomData
        });

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
