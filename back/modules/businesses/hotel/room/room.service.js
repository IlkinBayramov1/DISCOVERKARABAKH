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

        return prisma.roomType.create({
            data: {
                ...data,
                hotelId
            }
        });
    }

    /**
     * Fetches room types grouped by a Hotel
     */
    async getRoomsByHotel(hotelId) {
        return prisma.roomType.findMany({
            where: { hotelId },
            orderBy: { price: 'asc' }
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

        const updated = await prisma.roomType.update({
            where: { id: roomId },
            data
        });

        // Event trigger if we dropped inventory drastically
        if (updated.inventoryCount === 0) {
            hotelEvents.emit(ROOM_INVENTORY_DEPLETED, { hotelId, roomId });
        }

        return updated;
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
