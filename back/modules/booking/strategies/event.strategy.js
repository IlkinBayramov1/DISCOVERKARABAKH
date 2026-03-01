import { BookingStrategy } from '../booking.strategy.js';
import prisma from '../../../config/db.js';
import { ApiError } from '../../../core/api.error.js';

export class EventBookingStrategy extends BookingStrategy {
    async validateAvailability(data) {
        const { businessId, eventDetails } = data;

        const eventEntity = await prisma.event.findUnique({ where: { id: businessId } });
        if (!eventEntity) throw ApiError.notFound('Event not found');
        if (eventEntity.status !== 'active') throw ApiError.badRequest('Event is no longer active');

        const capacityRemaining = eventEntity.capacity - eventEntity.soldCount;
        if (capacityRemaining < eventDetails.ticketCount) {
            throw ApiError.badRequest(`Only ${capacityRemaining} tickets remain available for this event.`);
        }

        return { eventEntity, eventDetails };
    }

    async calculatePrice(context, data) {
        const { eventEntity, eventDetails } = context;
        return eventEntity.ticketPrice * eventDetails.ticketCount;
    }

    async generateDetailsPayload(context, data) {
        const { eventDetails } = context;
        return eventDetails; // { ticketCount, admissionType, etc }
    }

    async onBookingSuccess(booking) {
        // Increment soldCount
        const ticketCount = booking.details?.ticketCount || 1;
        await prisma.event.update({
            where: { id: booking.eventId },
            data: { soldCount: { increment: ticketCount } }
        });
    }

    async onBookingCancelled(booking) {
        const ticketCount = booking.details?.ticketCount || 1;
        await prisma.event.update({
            where: { id: booking.eventId },
            data: { soldCount: { decrement: ticketCount } }
        });
    }
}
