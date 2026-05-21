import { BookingStrategy } from '../booking.strategy.js';
import prisma from '../../../config/db.js';
import { ApiError } from '../../../core/api.error.js';
import { notificationService } from '../../shared/notification/notification.service.js';

export class AttractionBookingStrategy extends BookingStrategy {
    async validateAvailability(data) {
        const { entityId, visitDate, participants, guests, items } = data;
        
        // Handle generic keys or specific ones
        const finalVisitDate = visitDate || items?.[0]?.checkIn;
        const finalParticipants = participants || (items?.[0]?.adults + (items?.[0]?.children || 0));

        if (!finalVisitDate) {
            throw ApiError.badRequest('Visit date is required.');
        }
        if (!finalParticipants || finalParticipants < 1) {
            throw ApiError.badRequest('Number of participants must be at least 1.');
        }

        const attraction = await prisma.attraction.findUnique({ 
            where: { id: entityId },
            include: { attractionworkinghour: true }
        });
        if (!attraction) throw ApiError.notFound('Attraction not found');

        if (attraction.status !== 'active') {
            throw ApiError.badRequest('This destination is currently closed for visitors.');
        }

        // Validate Working Hours
        if (attraction.attractionworkinghour && attraction.attractionworkinghour.length > 0) {
            const date = new Date(finalVisitDate);
            const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
            const schedule = attraction.attractionworkinghour.find(h => h.dayOfWeek === dayOfWeek);

            if (schedule && schedule.isClosed) {
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                throw ApiError.badRequest(`This destination is closed on ${days[dayOfWeek]}s.`);
            }
        }

        // Prevent booking for past dates
        if (new Date(finalVisitDate) < new Date(new Date().setHours(0,0,0,0))) {
            throw ApiError.badRequest('Cannot book for a past date');
        }

        // Check if it's actually a paid attraction
        if (attraction.entryType === 'free') {
            throw ApiError.badRequest('This is a free destination and does not require a reservation.');
        }
        
        // Map vendorId for BookingService
        data.vendorId = attraction.vendorId;
        
        return { attraction, visitDate: finalVisitDate, participants: finalParticipants, guests };
    }
        
    async calculatePrice(context, data) {
        const { attraction, participants } = context;
        const price = attraction.price || 0;
        return price * participants;
    }
        
    async generateDetailsPayload(context, data) {
        const { attraction, visitDate, participants, guests } = context;
        
        const item = {
            checkIn: new Date(visitDate),
            adults: participants,
            children: 0,
            price: (attraction.price || 0) * participants,
        };

        const mappedGuests = guests ? guests.map(g => ({
            firstName: g.firstName,
            lastName: g.lastName,
            nationality: g.nationality,
            phone: g.phone,
            email: g.email
        })) : [];

        return {
            items: [item],
            guests: mappedGuests
        };
    }

    async onBookingSuccess(booking) {
        // Fire Email/SMS Notification
        await notificationService.sendBookingConfirmation(booking);
    }

    async onBookingCancelled(booking) {
        const fullBooking = await prisma.booking.findUnique({
            where: { id: booking.id },
            include: { items: true }
        });

        // Fire Cancellation Notification
        await notificationService.sendBookingCancellation(fullBooking);
    }
}
