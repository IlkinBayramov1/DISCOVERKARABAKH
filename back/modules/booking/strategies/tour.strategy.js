import { BookingStrategy } from '../booking.strategy.js';
import prisma from '../../../config/db.js';
import { tourRepository } from '../../businesses/tour/tour.repository.js';
import { ApiError } from '../../../core/api.error.js';
import { tourEvents, TOUR_RESERVATION_CREATED, TOUR_RESERVATION_CANCELLED } from '../../businesses/tour/tour.events.js';
import { notificationService } from '../../shared/notification/notification.service.js';

export class TourBookingStrategy extends BookingStrategy {
    async validateAvailability(data) {
        const { entityId, tourDate, participants, items } = data;
        
        const finalTourDate = tourDate || items?.[0]?.checkIn;
        const finalParticipants = participants || (items?.[0]?.adults + (items?.[0]?.children || 0));

        if (!finalTourDate) throw ApiError.badRequest('Tour date is required.');
        if (!finalParticipants || finalParticipants < 1) throw ApiError.badRequest('Number of participants must be at least 1.');

        const tour = await prisma.tour.findUnique({ where: { id: entityId } });
        if (!tour) throw ApiError.notFound('Tour not found');

        // 1. Prevent past dates
        if (new Date(finalTourDate) < new Date(new Date().setHours(0,0,0,0))) {
            throw ApiError.badRequest('Cannot book a tour in the past');
        }

        // 2. Fetch Availability Overrides
        const dateStr = new Date(finalTourDate).toISOString().split('T')[0];
        const override = await tourRepository.findAvailabilityByDate(entityId, dateStr);
        const bookedCount = await tourRepository.countBookedParticipants(entityId, dateStr);

        const maxSeats = override?.maxSeats ?? tour.groupSizeMax;
        const isStopped = override?.isStopped ?? false;
        const price = override?.priceOverride ?? tour.pricePerPerson;
        
        const remainingSeats = Math.max(0, maxSeats - bookedCount);

        if (isStopped) {
            throw ApiError.badRequest('This tour is not available for the selected date.');
        }

        if (finalParticipants > remainingSeats) {
            if (remainingSeats <= 0) {
                throw ApiError.badRequest('This tour is fully booked for this date.');
            }
            throw ApiError.badRequest(`Not enough seats available. Only ${remainingSeats} seat(s) left.`);
        }
        
        data.vendorId = tour.ownerId;
        
        return { 
            tour, 
            tourDate: finalTourDate, 
            participants: finalParticipants, 
            guests: data.guests,
            activePrice: price 
        };
    }
        
    async calculatePrice(context, data) {
        const { participants, activePrice } = context;
        return activePrice * participants;
    }
        
    async generateDetailsPayload(context, data) {
        const { tour, tourDate, participants, guests, activePrice } = context;
        
        const item = {
            checkIn: new Date(tourDate),
            adults: participants,
            children: 0,
            price: activePrice * participants,
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
