import { BookingStrategy } from '../booking.strategy.js';
import prisma from '../../../config/db.js';
import { tourRepository } from '../../businesses/tour/tour.repository.js';
import { ApiError } from '../../../core/api.error.js';
import { tourEvents, TOUR_RESERVATION_CREATED, TOUR_RESERVATION_CANCELLED } from '../../businesses/tour/tour.events.js';
import { notificationService } from '../../shared/notification/notification.service.js';

export class TourBookingStrategy extends BookingStrategy {
    async validateAvailability(data) {
        const { entityId, tourDate, participants, guests, items } = data;
        
        // Robust fallback: if tourDate is missing at root, try getting it from items[0]
        const finalTourDate = tourDate || items?.[0]?.checkIn;
        const finalParticipants = participants || (items?.[0]?.adults + (items?.[0]?.children || 0));

        if (!finalTourDate) {
            throw ApiError.badRequest(`Tour date is required. Received fields: ${Object.keys(data).join(', ')}`);
        }
        if (!finalParticipants || finalParticipants < 1) {
            throw ApiError.badRequest(`Number of participants must be at least 1. Received participants: ${finalParticipants}`);
        }

        const tour = await prisma.tour.findUnique({ where: { id: entityId } });
        if (!tour) throw ApiError.notFound('Tour not found');

        // 1. Validate the requested date matches the tour's startDate
        const requestedDateStr = new Date(finalTourDate).toISOString().split('T')[0];
        
        if (!tour.startDate || new Date(tour.startDate).toISOString().split('T')[0] !== requestedDateStr) {
            throw ApiError.badRequest(`This tour is only available on ${tour.startDate ? new Date(tour.startDate).toLocaleDateString() : 'an unspecified date'}`);
        }

        // 2. Prevent booking for past dates
        if (new Date(finalTourDate) < new Date(new Date().setHours(0,0,0,0))) {
            throw ApiError.badRequest('Cannot book a tour in the past');
        }
        
        // 3. Strict Capacity Check
        const totalRequested = finalParticipants;
        const available = tour.availableSlots ?? (tour.groupSizeMax - currentParticipantsCount);

        if (totalRequested > available) {
            if (available <= 0) {
                throw ApiError.badRequest('This tour is fully booked for this date.');
            }
            throw ApiError.badRequest(`Not enough seats available. Only ${available} seat(s) left. Please reduce your participant count.`);
        }
        
        // Map vendorId for BookingService
        data.vendorId = tour.ownerId;
        
        return { tour, tourDate: finalTourDate, participants: finalParticipants, guests };
    }
        
    async calculatePrice(context, data) {
        const { tour, participants } = context;
        return tour.pricePerPerson * participants;
    }
        
    async generateDetailsPayload(context, data) {
        const { tour, tourDate, participants, guests } = context;
        
        const item = {
            checkIn: new Date(tourDate),
            adults: participants,
            children: 0,
            price: tour.pricePerPerson * participants,
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

    async performTransactionActions(tx, booking, data) {
        const participants = data.participants || (data.items?.[0]?.adults + (data.items?.[0]?.children || 0));
        await tourRepository.decrementAvailableSlots(booking.entityId, participants, tx);
    }

    async onBookingSuccess(booking) {
        // Broadcast Domain isolated Event
        tourEvents.emit(TOUR_RESERVATION_CREATED, {
            bookingId: booking.id,
            tourId: booking.tourId,
            totalPrice: booking.totalPrice,
            timestamp: new Date()
        });

        // Fire Email/SMS Notification
        await notificationService.sendBookingConfirmation(booking);
    }

    async onBookingCancelled(booking) {
        const fullBooking = await prisma.booking.findUnique({
            where: { id: booking.id },
            include: { items: true }
        });

        // Broadcast Cancellation Event 
        tourEvents.emit(TOUR_RESERVATION_CANCELLED, {
            bookingId: booking.id,
            tourId: booking.tourId,
            timestamp: new Date()
        });

        // Increment available slots back
        const participants = fullBooking.items.reduce((sum, item) => sum + (item.adults + (item.children || 0)), 0);
        await tourRepository.incrementAvailableSlots(fullBooking.entityId, participants);

        // Fire Cancellation Notification
        await notificationService.sendBookingCancellation(fullBooking);
    }
}
