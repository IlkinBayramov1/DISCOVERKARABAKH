import { BookingStrategy } from '../booking.strategy.js';
import prisma from '../../../config/db.js';
import { ApiError } from '../../../core/api.error.js';
import { pricingEngine } from '../../businesses/hotel/pricing/pricing.engine.js';
import { hotelEvents } from '../../businesses/hotel/hotel.events.js';
import { fraudDetectionService } from '../../businesses/hotel/fraud/fraud.service.js';

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
        if (userId) { // Ensures we have contexts (guest checkouts handled alternatively)
            const riskAssessment = await fraudDetectionService.evaluateTransactionRisk(userId, { items });
            if (!riskAssessment.isApproved) {
                // Return a generic error to attackers so they don't map the bounds
                throw ApiError.forbidden('Transaction declined due to security policy violations.');
            }
        }

        const hotel = await prisma.hotel.findUnique({
            where: { id: entityId },
            include: { roomTypes: true }
        });

        if (!hotel) throw ApiError.notFound('Hotel not found');
        if (hotel.status !== 'active') throw ApiError.badRequest('Hotel is not actively accepting reservations');

        // Add dynamically resolved hotelId to the data payload so PricingEngine can resolve applicable Hotel Taxes
        data.vendorId = hotel.id;

        // Basic verification that selected roomTypes actually belong to this hotel
        for (const item of items) {
            const roomType = hotel.roomTypes.find(r => r.id === item.roomTypeId);
            if (!roomType) {
                throw ApiError.badRequest(`Requested RoomType (${item.roomTypeId}) does not belong to this Hotel`);
            }
            if ((item.adults + item.children) > (roomType.maxAdults + roomType.maxChildren)) {
                throw ApiError.badRequest(`Occupancy limit exceeded for RoomType: ${roomType.name}`);
            }

            // Real Availability checking & Serialization Locking goes here in Production Phase:
            // e.g. await lockInventoryService.pessimisticLock(item.roomTypeId, item.checkIn, item.checkOut)
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
        // Broadcast Domain isolated Event
        hotelEvents.emit('RESERVATION_CREATED', {
            bookingId: booking.id,
            hotelId: booking.hotelId,
            totalPrice: booking.totalPrice,
            timestamp: new Date()
        });

        // E.g Decrement Inventory Availabilities based on locked records
    }

    async onBookingCancelled(booking) {
        // Broadcast Cancellation Event 
        hotelEvents.emit('RESERVATION_CANCELLED', {
            bookingId: booking.id,
            hotelId: booking.hotelId,
            timestamp: new Date()
        });

        // E.g Release optimistic locks or revert RoomAvailability increments
    }
}
