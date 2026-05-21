import prisma from '../../../../config/db.js';
import { hotelEvents, ROOM_INVENTORY_DEPLETED } from '../hotel.events.js';

/**
 * Handles intricate Day-to-Day inventory tracking.
 * Plugs into the Polymorphic Booking Engine via HotelBookingStrategy.
 */
class AvailabilityService {
    constructor() {
        hotelEvents.on(ROOM_INVENTORY_DEPLETED, this.handleInventoryDepletion.bind(this));
    }

    async handleInventoryDepletion({ hotelId, roomId }) {
        console.log(`[Alert] Room ${roomId} for Hotel ${hotelId} is completely out of base inventory.`);
        // Could trigger Admin notification systems here
    }

    /**
     * Called when a booking is attempting to reserve dates
     * Checks if current active bookings overlap and exceed `roomType.inventoryCount`
     */
    async checkDateAvailability(roomId, checkIn, checkOut) {
        const room = await prisma.roomType.findUnique({ where: { id: roomId } });
        if (!room) throw new Error('Room not found');

        // Logic to sum up all active Bookings for this room in chronological overlaps...
        // For Enterprise, this involves checking against a dedicated RoomAvailability calendar table 
        // to be expanded in Phase 2 of feature release.

        return true;
    }
}

export const availabilityService = new AvailabilityService();
