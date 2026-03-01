import { bookingStrategyRegistry } from './booking.strategy.js';
import { HotelBookingStrategy } from './strategies/hotel.strategy.js';
import { TourBookingStrategy } from './strategies/tour.strategy.js';
import { EventBookingStrategy } from './strategies/event.strategy.js';
import prisma from '../../config/db.js';
import { ApiError } from '../../core/api.error.js';
import crypto from 'crypto';

// Pre-Register Strategies on boot
bookingStrategyRegistry.register('hotel', new HotelBookingStrategy());
bookingStrategyRegistry.register('tour', new TourBookingStrategy());
bookingStrategyRegistry.register('event', new EventBookingStrategy());

class BookingService {

    // Generate PNR
    _generatePNR() {
        return 'BKG-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    }

    async createBooking(userId, type, entityId, data) {
        const strategy = bookingStrategyRegistry.getStrategy(type);
        if (!strategy) throw ApiError.badRequest(`Unsupported booking type: ${type}`);

        // 1. Contextual validation & Availability Lock
        const context = await strategy.validateAvailability(data);

        // 2. Exact Price Calculation (Centralized Pricing logic for Hotels invoked here)
        const totalPrice = await strategy.calculatePrice(context, data);

        // 3. Payload detail formatting (handles Items array, Guests, specific metadata)
        const details = await strategy.generateDetailsPayload(context, data);

        // 4. Create master polymorphic reservation inside DB Transaction 
        // to securely spawn Booking, Items, Guests, and AuditLogs atomically.
        const booking = await prisma.$transaction(async (tx) => {
            const newBooking = await tx.booking.create({
                data: {
                    bookingNumber: this._generatePNR(),
                    bookingType: type,
                    entityId: entityId,
                    userId,
                    vendorId: data.vendorId, // Enforced by Strategy validation layer

                    status: 'draft',
                    paymentStatus: 'initiated',

                    totalPrice,
                    currency: data.currency || 'AZN',

                    hotelId: type === 'hotel' ? entityId : null,

                    // Specific sub-models injected from Strategy
                    items: {
                        create: details.items || []
                    },
                    guests: {
                        create: details.guests || []
                    },
                    auditLogs: {
                        create: [{
                            action: 'created',
                            meta: { source: 'api', message: 'Booking Initialized in Draft' }
                        }]
                    }
                },
                include: { items: true, guests: true }
            });

            return newBooking;
        });

        // 5. Fire Hooks (Confirmations, Redis Unlocks, Webhooks)
        await strategy.onBookingSuccess(booking);

        return booking;
    }

    async getMyBookings(userId) {
        return prisma.booking.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                hotel: { select: { name: true, address: true } },
                items: true,
                guests: true
            }
        });
    }

    async getVendorBookings(vendorId) {
        return prisma.booking.findMany({
            where: { vendorId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { email: true } },
                hotel: { select: { name: true } },
                items: true
            }
        });
    }

    async cancelBooking(bookingId, userId) {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) throw ApiError.notFound('Booking not found');
        if (booking.userId !== userId) throw ApiError.forbidden('Not authorized to cancel this booking');

        const strategy = bookingStrategyRegistry.getStrategy(booking.bookingType);

        const updated = await prisma.$transaction(async (tx) => {
            const b = await tx.booking.update({
                where: { id: bookingId },
                data: { status: 'cancelled' }
            });

            await tx.bookingAuditLog.create({
                data: {
                    bookingId,
                    action: 'cancelled',
                    meta: { initator: 'user', timestamp: new Date() }
                }
            });

            return b;
        });

        if (strategy) {
            await strategy.onBookingCancelled(updated);
        }

        return updated;
    }
}

export const bookingService = new BookingService();
