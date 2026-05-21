import { BookingStrategy } from '../booking.strategy.js';
import prisma from '../../../config/db.js';
import { ApiError } from '../../../core/api.error.js';
import { pricingEngine } from '../../businesses/hotel/pricing/pricing.engine.js';
import { hotelEvents } from '../../businesses/hotel/hotel.events.js';
import { fraudDetectionService } from '../../businesses/hotel/fraud/fraud.service.js';
import { inventoryLockService } from '../../businesses/hotel/availability/inventoryLock.service.js';
import { notificationService } from '../../shared/notification/notification.service.js';

export class HotelBookingStrategy extends BookingStrategy {

    // Validates if the hotel exists, bounds ownership, checks fraud constraints, and constructs locking context
    async validateAvailability(data) {
        // data.entityId is the hotelId (handled in controller)
        // data.items maps to BookingItems [ { roomTypeId, ratePlanId, checkIn, checkOut, adults, children } ]
        const { entityId, items, guests, userId } = data;

        if (!items || items.length === 0) {
            throw ApiError.badRequest('No rooms selected for booking.');
        }

        // --- Fraud & Risk Check Pipeline ---
        if (userId) { 
            // Calculate a dry-run price for risk assessment
            const { totalAmount } = await pricingEngine.calculateStayPrice({ entityId, items });

            const riskAssessment = await fraudDetectionService.evaluateTransactionRisk(userId, { 
                items, 
                totalAmount 
            });

            if (!riskAssessment.isApproved) {
                // Return a generic error to prevent mapping security bounds
                throw ApiError.forbidden('Transaction declined due to security policy violations.');
            }
        }

        const hotel = await prisma.hotel.findUnique({
            where: { id: entityId },
            include: { roomtype: true }
        });

        if (!hotel) throw ApiError.notFound('Hotel not found');
        if (hotel.status !== 'active') throw ApiError.badRequest('Hotel is not actively accepting reservations');

        // Add dynamically resolved ownerId to the data payload so BookingService can map the Booking to the Vendor
        data.vendorId = hotel.ownerId;
        data.hotelId = hotel.id;

        for (const item of items) {
            const roomType = hotel.roomtype.find(r => r.id === item.roomTypeId);
            if (!roomType) {
                throw ApiError.badRequest(`Requested RoomType (${item.roomTypeId}) does not belong to this Hotel`);
            }
            if (!roomType.isActive) {
                throw ApiError.badRequest(`Room ${roomType.name} is currently inactive and not accepting reservations.`);
            }
            if ((item.adults + item.children) > (roomType.maxAdults + roomType.maxChildren)) {
                throw ApiError.badRequest(`Occupancy limit exceeded for RoomType: ${roomType.name}`);
            }

            // Real Availability checking
            const checkInDate = new Date(item.checkIn + 'T00:00:00.000Z');
            const checkOutDate = new Date(item.checkOut + 'T00:00:00.000Z');

            const pricingMatrix = await prisma.dailypricing.findMany({
                where: {
                    roomTypeId: item.roomTypeId,
                    date: { gte: checkInDate, lt: checkOutDate }
                }
            });

            // Fetch actual availability records
            const availabilityMatrix = await prisma.roomavailability.findMany({
                where: {
                    roomTypeId: item.roomTypeId,
                    date: { gte: checkInDate, lt: checkOutDate }
                }
            });

            const totalNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
            if (pricingMatrix.length !== totalNights || availabilityMatrix.length !== totalNights) {
                throw ApiError.badRequest(`Missing pricing or availability rules for requested dates.`);
            }

            for (const day of availabilityMatrix) {
                // Count active locks for this date
                const activeLocks = await inventoryLockService.getActiveLocksForDate(item.roomTypeId, day.date);
                
                const trulyAvailable = day.totalRooms - (day.reservedRooms + activeLocks);

                if (trulyAvailable <= 0) {
                    throw ApiError.badRequest(`Room ${roomType.name} is fully booked or held on ${day.date.toISOString().split('T')[0]}`);
                }

                // Pricing record for MLOS and StopSell constraints
                const pricingDay = pricingMatrix.find(p => p.date.getTime() === day.date.getTime());
                if (!pricingDay) throw ApiError.badRequest(`Missing pricing record for ${day.date.toISOString().split('T')[0]}`);

                // Stop Sell Enforcement
                if (pricingDay.isStopped) {
                    throw ApiError.badRequest(`Sales for ${roomType.name} are temporarily stopped for ${day.date.toISOString().split('T')[0]}.`);
                }

                // MLOS (Min/Max Stay) Enforcement
                if (totalNights < pricingDay.minStay) {
                    throw ApiError.badRequest(`Minimum stay for ${roomType.name} on ${pricingDay.date.toISOString().split('T')[0]} is ${pricingDay.minStay} night(s). You requested ${totalNights}.`);
                }
                if (pricingDay.maxStay && totalNights > pricingDay.maxStay) {
                    throw ApiError.badRequest(`Maximum stay for ${roomType.name} on ${pricingDay.date.toISOString().split('T')[0]} is ${pricingDay.maxStay} night(s). You requested ${totalNights}.`);
                }
            }
        }

        return { hotel, items, guests };
    }

    // Hands off all logic purely to the PricingEngine 
    async calculatePrice(context, data) {
        // Pass the entire data object (which now holds the resolved items and vendorId) to the Engine
        const pricingResult = await pricingEngine.calculateStayPrice(data);

        // Mutating the context temporarily so generateDetailsPayload can retrieve the exact nightly breakdowns later
        context.pricingResult = pricingResult;

        return pricingResult.exactTotal; // Resolves Gross Price + Taxes explicitly calculated
    }

    // Formats the Prisma relational structure natively 
    async generateDetailsPayload(context, data) {
        const { pricingResult, items, guests } = context;

        // Map items securely matching the Prisma BookingItem Schema Model
        const mappedItems = items.map((item, index) => {
            const respectiveBreakdown = pricingResult.breakdowns.find(b => b.roomTypeId === item.roomTypeId);

            return {
                roomTypeId: item.roomTypeId,
                ratePlanId: item.ratePlanId || null,
                checkIn: new Date(item.checkIn),
                checkOut: new Date(item.checkOut),
                adults: item.adults,
                children: item.children || 0,
                price: respectiveBreakdown ? respectiveBreakdown.subtotal : 0,
                nightlyBreakdown: respectiveBreakdown ? respectiveBreakdown.log : []
            };
        });

        // Map guests natively
        const mappedGuests = guests ? guests.map(g => ({
            firstName: g.firstName,
            lastName: g.lastName,
            nationality: g.nationality,
            phone: g.phone,
            email: g.email
        })) : [];

        // Return properties injected as prisma relations in Booking Transaction Service
        return {
            items: mappedItems,
            guests: mappedGuests
        };
    }

    // Hook triggered upon Successful Commit of the Transaction
    async onBookingSuccess(booking) {
        // Increment reservedRooms
        if (booking.items && booking.items.length > 0) {
            for (const item of booking.items) {
                await prisma.roomavailability.updateMany({
                    where: {
                        roomTypeId: item.roomTypeId,
                        date: {
                            gte: new Date(item.checkIn),
                            lt: new Date(item.checkOut)
                        }
                    },
                    data: {
                        reservedRooms: { increment: 1 }
                    }
                });

                // Release user's temporary locks for these rooms
                await prisma.inventorylock.deleteMany({
                    where: {
                        userId: booking.userId,
                        roomTypeId: item.roomTypeId,
                        startDate: new Date(item.checkIn),
                        endDate: new Date(item.checkOut)
                    }
                });
            }
        }

        // Broadcast Domain isolated Event
        hotelEvents.emit('RESERVATION_CREATED', {
            bookingId: booking.id,
            hotelId: booking.hotelId,
            totalPrice: booking.totalPrice,
            timestamp: new Date()
        });

        // Fire Email/SMS Notification
        await notificationService.sendBookingConfirmation(booking);
    }

    async onBookingCancelled(booking) {
        // Decrement reservedRooms
        const fullBooking = await prisma.booking.findUnique({
            where: { id: booking.id },
            include: { items: true }
        });

        if (fullBooking && fullBooking.items) {
            for (const item of fullBooking.items) {
                await prisma.roomavailability.updateMany({
                    where: {
                        roomTypeId: item.roomTypeId,
                        date: {
                            gte: new Date(item.checkIn),
                            lt: new Date(item.checkOut)
                        }
                    },
                    data: {
                        reservedRooms: { decrement: 1 }
                    }
                });
            }
        }

        // Broadcast Cancellation Event 
        hotelEvents.emit('RESERVATION_CANCELLED', {
            bookingId: booking.id,
            hotelId: booking.hotelId,
            timestamp: new Date()
        });

        // Fire Cancellation Notification
        await notificationService.sendBookingCancellation(fullBooking);
    }
}
