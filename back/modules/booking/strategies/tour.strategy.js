import { BookingStrategy } from '../booking.strategy.js';
import prisma from '../../../config/db.js';
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
        
        // 3. Count existing active bookings for this date
        const existingBookings = await prisma.booking.findMany({
            where: {
                tourId: entityId,
                status: { in: ['pending_payment', 'confirmed', 'checked_in'] },
                items: {
                    some: {
                        checkIn: new Date(finalTourDate)
                    }
                }
            },
            include: {
                items: true
            }
        });
        
        let currentParticipantsCount = 0;
        existingBookings.forEach(b => {
            b.items.forEach(item => {
                // Ensure we only count items matching the specific date
                if (new Date(item.checkIn).getTime() === new Date(finalTourDate).getTime()) {
                    currentParticipantsCount += (item.adults + (item.children || 0));
                }
            });
        });
        
        // 4. Capacity check
        const totalAfterBooking = currentParticipantsCount + finalParticipants;
        if (totalAfterBooking > tour.groupSizeMax) {
            const seatsLeft = tour.groupSizeMax - currentParticipantsCount;
            throw ApiError.badRequest(`Tour is full for this date. Seats remaining: ${seatsLeft > 0 ? seatsLeft : 0}`);
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

        // Fire Cancellation Notification
        await notificationService.sendBookingCancellation(fullBooking);
    }
}
