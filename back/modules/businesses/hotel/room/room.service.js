import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';
import { hotelEvents, ROOM_INVENTORY_DEPLETED } from '../hotel.events.js';

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
                    create: amenities.map(name => ({ amenityName: name }))
                } : undefined
            },
            include: { images: true, roomAmenities: true }
        });
    }

    /**
     * Fetches room types grouped by a Hotel
     */
    async getRoomsByHotel(hotelId) {
        return prisma.roomType.findMany({
            where: { hotelId },
            include: { images: true, roomAmenities: true },
            orderBy: { name: 'asc' }
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
                    data: amenities.map(name => ({ roomTypeId: roomId, amenityName: name }))
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

        return fullRoom;
    }

    async deleteRoomType(hotelId, roomId, vendorId) {
        const room = await prisma.roomType.findFirst({
            where: { id: roomId, hotelId },
            include: { hotel: true }
        });

        if (!room) throw ApiError.notFound('Room not found in this hotel');
        if (room.hotel.ownerId !== vendorId) throw ApiError.forbidden('Unauthorized');

        return prisma.roomType.delete({ where: { id: roomId } });
    }
}

export const roomService = new RoomService();
