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
            include: { user: true }
        });
        
        if (!vehicle) throw ApiError.notFound('Vehicle not found');

        if (vehicle.status !== 'Active') {
            throw ApiError.badRequest('This vehicle is currently unavailable.');
        }

        // 3-hour buffer check
        const requestedTime = new Date(scheduledTime);
        const bufferStart = new Date(requestedTime.getTime() - 3 * 60 * 60 * 1000);
        const bufferEnd = new Date(requestedTime.getTime() + 3 * 60 * 60 * 1000);

        const conflictingRide = await prisma.ride.findFirst({
            where: {
                vehicleId: entityId,
                status: { notIn: ['Cancelled', 'Completed'] },
                scheduledAt: {
                    gte: bufferStart,
                    lte: bufferEnd
                }
            }
        });

        if (conflictingRide) {
            throw ApiError.badRequest('This vehicle is already booked or busy within 3 hours of your requested time.');
        }

        // Prevent booking for past dates
        if (new Date(scheduledTime) < new Date(new Date().setHours(0,0,0,0))) {
            throw ApiError.badRequest('Cannot book for a past date');
        }

        if (!pickupLocation || !dropoffLocation) {
             console.error('[TransferStrategyError] Missing locations:', { pickupLocation, dropoffLocation });
             throw ApiError.badRequest('Pickup and Dropoff locations are required for transfer booking.');
        }

        // Standardize location format if it comes as a string (unlikely but safe)
        const finalPickup = typeof pickupLocation === 'string' ? { address: pickupLocation } : pickupLocation;
        const finalDropoff = typeof dropoffLocation === 'string' ? { address: dropoffLocation } : dropoffLocation;

        console.log(`[TransferStrategyDebug] Validating locations: ${finalPickup.address} -> ${finalDropoff.address}`);

        // Map vendorId for BookingService
        data.vendorId = vehicle.vendorId;
        
        return { 
            vehicle, 
            scheduledTime, 
            pickupLocation: finalPickup, 
            dropoffLocation: finalDropoff, 
            distanceKm: data.distanceKm || 0, 
            paxCount: data.participants || items?.[0]?.adults || 1 
        };
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
        const { scheduledTime, paxCount, pickupLocation, dropoffLocation } = context;
        const calculatedPrice = await this.calculatePrice(context, data);

        console.log(`[TransferStrategyDebug] Generating payload for ${scheduledTime}. Locations: ${pickupLocation?.address} -> ${dropoffLocation?.address}`);

        const item = {
            checkIn: new Date(scheduledTime),
            adults: paxCount,
            children: 0,
            price: calculatedPrice,
            meta: {
                pickupTime: scheduledTime,
                pickupLocation,
                dropoffLocation
            }
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
                id: crypto.randomUUID(),
                passengerId: booking.userId,
                vehicleId: data.entityId, // The assigned VIP car
                status: 'Pending',
                pickupLocation: typeof data.pickupLocation === 'string' ? data.pickupLocation : JSON.stringify(data.pickupLocation),
                dropoffLocation: typeof data.dropoffLocation === 'string' ? data.dropoffLocation : JSON.stringify(data.dropoffLocation),
                distanceKm: data.distanceKm || 0,
                price: booking.totalPrice,
                paxCount: data.participants || data.items?.[0]?.adults || 1,
                scheduledAt: new Date(scheduledTime),
                bookingNumber: booking.bookingNumber,
                updatedAt: new Date()
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
