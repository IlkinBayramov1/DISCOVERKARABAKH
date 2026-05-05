import { bookingStrategyRegistry } from './booking.strategy.js';
import { HotelBookingStrategy } from './strategies/hotel.strategy.js';
import { TourBookingStrategy } from './strategies/tour.strategy.js';
import { EventBookingStrategy } from './strategies/event.strategy.js';
import { AttractionBookingStrategy } from './strategies/attraction.strategy.js';
import { TransferBookingStrategy } from './strategies/transfer.strategy.js';
import { paymentService } from '../payments/payment.service.js';
import prisma from '../../config/db.js';
import { ApiError } from '../../core/api.error.js';
import crypto from 'crypto';

// Pre-Register Strategies on boot
bookingStrategyRegistry.register('hotel', new HotelBookingStrategy());
bookingStrategyRegistry.register('tour', new TourBookingStrategy());
bookingStrategyRegistry.register('event', new EventBookingStrategy());
bookingStrategyRegistry.register('attraction', new AttractionBookingStrategy());
bookingStrategyRegistry.register('transfer', new TransferBookingStrategy());

class BookingService {

    // Generate PNR
    _generatePNR() {
        return 'BKG-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    }

    async createBooking(userId, type, entityId, data) {
        const strategy = bookingStrategyRegistry.getStrategy(type);
        if (!strategy) throw ApiError.badRequest(`Unsupported booking type: ${type}`);

        data.entityId = entityId;
        data.userId = userId;

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
                    user: { connect: { id: userId } },
                    vendorId: data.vendorId, // Enforced by Strategy validation layer

                    status: 'confirmed',
                    paymentStatus: 'captured',
                    paymentMethod: data.paymentMethod || 'Direct Confirmation',
                    specialRequests: data.specialRequests || null,

                    totalPrice,
                    currency: data.currency || 'AZN',

                    hotel: type === 'hotel' ? { connect: { id: entityId } } : undefined,
                    tour: type === 'tour' ? { connect: { id: entityId } } : undefined,
                    event: type === 'event' ? { connect: { id: entityId } } : undefined,
                    attraction: type === 'attraction' ? { connect: { id: entityId } } : undefined,
                    vehicle: type === 'transfer' ? { connect: { id: entityId } } : undefined,

                    // Specific sub-models injected from Strategy
                    bookingitem: {
                        create: details.items || []
                    },
                    guest: {
                        create: details.guests || []
                    },
                    bookingauditlog: {
                        create: [{
                            action: 'created',
                            meta: { source: 'api', message: 'Booking Confirmed (Payment Bypassed)' }
                        }]
                    }
                },
                include: { bookingitem: true, guest: true }
            });

            // 4.1 Perform any strategy-specific atomic actions (e.g., decrement tour slots)
            if (strategy.performTransactionActions) {
                await strategy.performTransactionActions(tx, newBooking, data);
            }

            return newBooking;
        });

        // 5. Bypass Payment Initiation (Temporarily Disabled for development)
        // const transaction = await paymentService.initiatePayment(booking.id, userId, data.paymentProvider || 'local');

        // 6. Fire Success Hooks Immediately
        await strategy.onBookingSuccess(booking);

        return { ...booking, status: 'confirmed' };
    }

    async previewPrice(userId, type, entityId, data) {
        const strategy = bookingStrategyRegistry.getStrategy(type);
        if (!strategy) throw ApiError.badRequest(`Unsupported booking type: ${type}`);

        data.entityId = entityId;
        data.userId = userId;

        // 1. Contextual validation
        const context = await strategy.validateAvailability(data);

        // 2. Exact Price Calculation
        // Since `strategy.calculatePrice` calls `pricingEngine.calculateStayPrice` which returns full break down to `context.pricingResult`.
        const totalPrice = await strategy.calculatePrice(context, data);

        // Include taxes and detailed logic natively from context
        return {
            exactTotal: totalPrice,
            pricingResult: context.pricingResult || null,
            contextItems: data.items
        };
    }

    async lockInventory(userId, type, entityId, data) {
        const strategy = bookingStrategyRegistry.getStrategy(type);
        if (!strategy) throw ApiError.badRequest(`Unsupported booking type: ${type}`);
        if (type !== 'hotel') return { locked: false, message: 'Locking only supported for hotels currenty' };

        data.entityId = entityId;
        data.userId = userId;

        // 1. Validate availability (this also checks existing locks)
        await strategy.validateAvailability(data);

        // 2. Acquire locks for each room type in the booking
        const { inventoryLockService } = await import('../businesses/hotel/availability/inventoryLock.service.js');
        
        const lockIds = [];
        for (const item of data.items) {
            const lockId = await inventoryLockService.acquireLock(userId, item.roomTypeId, item.checkIn, item.checkOut);
            if (!lockId) {
                // Should not happen if validateAvailability passed, but for safety:
                throw ApiError.badRequest(`Failed to acquire lock for ${item.roomTypeId}. It might have just been taken.`);
            }
            lockIds.push(lockId);
        }

        return { locked: true, lockIds, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    }

    async getBookingById(bookingId, userId) {
        const booking = await prisma.booking.findFirst({
            where: { id: bookingId, userId },
            include: {
                hotel: { select: { name: true, address: true, checkInTime: true, checkOutTime: true, images: true } },
                tour: { select: { name: true, city: true, address: true, images: true } },
                event: { select: { title: true, location: true } },
                attraction: { select: { name: true, city: true, address: true, images: true } },
                vehicle: { select: { brand: true, model: true, images: true, category: true } },
                bookingitem: true,
                guest: true
            }
        });
        if (!booking) throw ApiError.notFound('Booking not found');

        // Manually stitch room names since no direct Prisma relation exists for roomType in BookingItem
        if (booking.bookingitem && booking.bookingitem.length > 0) {
            const roomIds = booking.bookingitem.map(i => i.roomTypeId).filter(Boolean);
            const rooms = await prisma.roomType.findMany({
                where: { id: { in: roomIds } },
                select: { id: true, name: true }
            });
            booking.bookingitem = booking.bookingitem.map(item => {
                const rt = rooms.find(r => r.id === item.roomTypeId);
                return { ...item, roomType: rt || null };
            });
        }

        return booking;
    }

    async getMyBookings(userId) {
        return prisma.booking.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                hotel: { select: { name: true, address: true, images: true } },
                tour: { select: { name: true, city: true, address: true, images: true } },
                attraction: { select: { name: true, city: true, address: true, images: true } },
                vehicle: { select: { brand: true, model: true, images: true, category: true } },
                bookingitem: true,
                guest: true
            }
        });
    }

    async getVendorBookings(vendorId) {
        return prisma.booking.findMany({
            where: { vendorId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { email: true, firstName: true, lastName: true, phone: true } },
                hotel: { select: { name: true } },
                tour: { select: { name: true } },
                event: { select: { title: true } },
                attraction: { select: { name: true } },
                bookingitem: true,
                guest: true
            }
        });
    }

    async updateVendorBookingStatus(bookingId, vendorId, action) {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) throw ApiError.notFound('Booking not found');
        if (booking.vendorId !== vendorId) throw ApiError.forbidden('You are not authorized to update this booking.');

        let newStatus = '';
        if (action === 'approve') newStatus = 'confirmed';
        else if (action === 'reject') newStatus = 'cancelled';
        else throw ApiError.badRequest('Invalid action. Must be approve or reject');

        const strategy = bookingStrategyRegistry.getStrategy(booking.bookingType);

        const updatedBooking = await prisma.$transaction(async (tx) => {
            const b = await tx.booking.update({
                where: { id: bookingId },
                data: { status: newStatus }
            });

            await tx.bookingauditlog.create({
                data: {
                    bookingId,
                    action: action === 'approve' ? 'vendor_approved' : 'vendor_rejected',
                    meta: { initator: 'vendor', vendorId, timestamp: new Date() }
                }
            });

            return b;
        });

        if (newStatus === 'cancelled' && strategy && typeof strategy.onBookingCancelled === 'function') {
            await strategy.onBookingCancelled(updatedBooking);
        }

        return updatedBooking;
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

            await tx.bookingauditlog.create({
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
