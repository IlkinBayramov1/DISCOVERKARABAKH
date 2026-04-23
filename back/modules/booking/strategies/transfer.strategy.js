import { BookingStrategy } from '../booking.strategy.js';
import prisma from '../../../config/db.js';
import { ApiError } from '../../../core/api.error.js';
import { notificationService } from '../../shared/notification/notification.service.js';

export class TransferBookingStrategy extends BookingStrategy {
    async validateAvailability(data) {
        const { entityId, visitDate, items, pickupLocation, dropoffLocation } = data;
        
        const scheduledTime = visitDate || items?.[0]?.checkIn;
        if (!scheduledTime) {
            throw ApiError.badRequest('Pickup time (scheduledAt) is required.');
        }

        const vehicle = await prisma.vehicle.findUnique({ 
            where: { id: entityId },
            include: { owner: true }
        });
        
        if (!vehicle) throw ApiError.notFound('Vehicle not found');

        if (vehicle.status !== 'Active') {
            throw ApiError.badRequest('This vehicle is currently unavailable.');
        }

        // Prevent booking for past dates
        if (new Date(scheduledTime) < new Date(new Date().setHours(0,0,0,0))) {
            throw ApiError.badRequest('Cannot book for a past date');
        }

        if (!pickupLocation || !dropoffLocation) {
             throw ApiError.badRequest('Pickup and Dropoff locations are required for transfer booking.');
        }

        // Map vendorId for BookingService
        data.vendorId = vehicle.vendorId;
        
        return { vehicle, scheduledTime, pickupLocation, dropoffLocation, distanceKm: data.distanceKm || 0, paxCount: data.participants || items?.[0]?.adults || 1 };
    }
        
    async calculatePrice(context, data) {
        // If price is already provided and validated in payload, use it
        if (data.totalPrice) return parseFloat(data.totalPrice);
        
        const { vehicle, distanceKm } = context;
        const basePrice = vehicle.basePrice || 5.0;
        const ratePerKm = vehicle.pricePerKm || 1.5;
        const price = basePrice + (distanceKm * ratePerKm);
        return parseFloat(price.toFixed(2));
    }
        
    async generateDetailsPayload(context, data) {
        const { scheduledTime, paxCount } = context;
        const calculatedPrice = await this.calculatePrice(context, data);

        const item = {
            checkIn: new Date(scheduledTime),
            adults: paxCount,
            children: 0,
            price: calculatedPrice,
        };

        const guests = data.guests ? data.guests.map(g => ({
            firstName: g.firstName,
            lastName: g.lastName,
            nationality: g.nationality,
            phone: g.phone,
            email: g.email
        })) : [];

        return {
            items: [item],
            guests: guests
        };
    }

    async performTransactionActions(tx, booking, data) {
        // Safe Atomic Ride Creation within Booking Transaction
        const scheduledTime = data.visitDate || data.items?.[0]?.checkIn;
        
        // We know distanceKm exist either from data or defaults from validation
        await tx.ride.create({
            data: {
                passengerId: booking.userId,
                vehicleId: data.entityId, // The assigned VIP car
                status: 'Pending',
                pickupLocation: data.pickupLocation,
                dropoffLocation: data.dropoffLocation,
                distanceKm: data.distanceKm || 0,
                price: booking.totalPrice,
                scheduledAt: new Date(scheduledTime),
                bookingNumber: booking.bookingNumber
            }
        });
    }

    async onBookingSuccess(booking) {
        // Fire Email/SMS Notification with PDF attached (handled globally if standard)
        await notificationService.sendBookingConfirmation(booking);
    }

    async onBookingCancelled(booking) {
        const fullBooking = await prisma.booking.findUnique({
            where: { id: booking.id },
            include: { items: true }
        });

        // Cancel the Ride in main DB
        await prisma.ride.updateMany({
            where: { bookingNumber: booking.bookingNumber },
            data: { status: 'Cancelled' }
        });

        // Fire Cancellation Notification
        await notificationService.sendBookingCancellation(fullBooking);
    }
}
