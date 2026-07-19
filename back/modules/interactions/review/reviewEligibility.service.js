import prisma from '../../../config/db.js';
import { reviewConfig } from '../../../config/review.config.js';

// Abstract Base Strategy
export class ReviewEligibilityStrategy {
    async canReview(tx, userId, businessId) {
        throw new Error("canReview() method must be implemented");
    }
}

// 1. Hotel Strategy
class HotelReviewStrategy extends ReviewEligibilityStrategy {
    async canReview(tx, userId, businessId) {
        // A. Duplicate Check
        const existing = await tx.review.findFirst({
            where: { userId, hotelId: businessId }
        });
        if (existing) {
            return { eligible: false, code: 'ALREADY_REVIEWED', message: 'Siz artıq bu otel üçün rəy yazmısınız.' };
        }

        // B. Booking Check
        const booking = await tx.booking.findFirst({
            where: {
                userId,
                hotelId: businessId,
                status: { in: reviewConfig.allowedReviewStatuses }
            },
            include: { bookingitem: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!booking) {
            return { eligible: false, code: 'NO_BOOKING', message: 'Bu otel üzrə aktiv rezervasiyanız tapılmadı.' };
        }

        // C. Chronological Check
        const firstItem = booking.bookingitem?.[0];
        if (!firstItem || !firstItem.checkIn) {
            return { eligible: false, code: 'INVALID_BOOKING_STATUS', message: 'Bron detallarında xəta var.' };
        }

        const nowUtc = new Date();
        const checkInUtc = new Date(firstItem.checkIn);
        if (checkInUtc > nowUtc) {
            return { eligible: false, code: 'TRAVEL_NOT_STARTED', message: 'Səyahətiniz hələ başlamadığı üçün rəy yaza bilməzsiniz.' };
        }

        return { eligible: true, code: 'ELIGIBLE', message: 'Rəy yazmaq mümkündür.' };
    }
}

// 2. Room Strategy
class RoomReviewStrategy extends ReviewEligibilityStrategy {
    async canReview(tx, userId, businessId) {
        const roomType = await tx.roomtype.findUnique({
            where: { id: businessId }
        });
        if (!roomType) {
            return { eligible: false, code: 'BUSINESS_NOT_FOUND', message: 'Otaq növü tapılmadı.' };
        }

        // A. Duplicate Check
        const existing = await tx.roomreview.findFirst({
            where: { userId, roomTypeId: businessId }
        });
        if (existing) {
            return { eligible: false, code: 'ALREADY_REVIEWED', message: 'Siz artıq bu otaq növü üçün rəy yazmısınız.' };
        }

        // B. Booking Check
        const booking = await tx.booking.findFirst({
            where: {
                userId,
                hotelId: roomType.hotelId,
                status: { in: reviewConfig.allowedReviewStatuses }
            },
            include: { bookingitem: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!booking) {
            return { eligible: false, code: 'NO_BOOKING', message: 'Bu otağın aid olduğu otel üzrə aktiv rezervasiyanız tapılmadı.' };
        }

        // C. Chronological Check
        const firstItem = booking.bookingitem?.[0];
        if (!firstItem || !firstItem.checkIn) {
            return { eligible: false, code: 'INVALID_BOOKING_STATUS', message: 'Bron detallarında xəta var.' };
        }

        const nowUtc = new Date();
        const checkInUtc = new Date(firstItem.checkIn);
        if (checkInUtc > nowUtc) {
            return { eligible: false, code: 'TRAVEL_NOT_STARTED', message: 'Səyahətiniz hələ başlamadığı üçün rəy yaza bilməzsiniz.' };
        }

        return { eligible: true, code: 'ELIGIBLE', message: 'Rəy yazmaq mümkündür.' };
    }
}

// 3. Tour Strategy
class TourReviewStrategy extends ReviewEligibilityStrategy {
    async canReview(tx, userId, businessId) {
        const tour = await tx.tour.findUnique({
            where: { id: businessId }
        });
        if (!tour) {
            return { eligible: false, code: 'BUSINESS_NOT_FOUND', message: 'Tur tapılmadı.' };
        }

        // A. Duplicate Check
        const existing = await tx.review.findFirst({
            where: { userId, tourId: businessId }
        });
        if (existing) {
            return { eligible: false, code: 'ALREADY_REVIEWED', message: 'Siz artıq bu tur üçün rəy yazmısınız.' };
        }

        // B. Free Tour Check
        const isFree = tour.pricePerPerson === 0 || tour.pricePerPerson <= 0;
        if (isFree) {
            return { eligible: true, code: 'FREE_SERVICE', message: 'Pulsuz turlar üçün rəy sərbəstdir.' };
        }

        // C. Booking Check
        const booking = await tx.booking.findFirst({
            where: {
                userId,
                tourId: businessId,
                status: { in: reviewConfig.allowedReviewStatuses }
            },
            include: { bookingitem: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!booking) {
            return { eligible: false, code: 'NO_BOOKING', message: 'Bu tur üzrə aktiv rezervasiyanız tapılmadı.' };
        }

        // D. Chronological Check
        const firstItem = booking.bookingitem?.[0];
        if (!firstItem || !firstItem.checkIn) {
            return { eligible: false, code: 'INVALID_BOOKING_STATUS', message: 'Bron detallarında xəta var.' };
        }

        const nowUtc = new Date();
        const checkInUtc = new Date(firstItem.checkIn);
        if (checkInUtc > nowUtc) {
            return { eligible: false, code: 'TRAVEL_NOT_STARTED', message: 'Səyahətiniz hələ başlamadığı üçün rəy yaza bilməzsiniz.' };
        }

        return { eligible: true, code: 'ELIGIBLE', message: 'Rəy yazmaq mümkündür.' };
    }
}

// 4. Event Strategy
class EventReviewStrategy extends ReviewEligibilityStrategy {
    async canReview(tx, userId, businessId) {
        const event = await tx.event.findUnique({
            where: { id: businessId }
        });
        if (!event) {
            return { eligible: false, code: 'BUSINESS_NOT_FOUND', message: 'Tədbir tapılmadı.' };
        }

        // A. Duplicate Check
        const existing = await tx.review.findFirst({
            where: { userId, eventId: businessId }
        });
        if (existing) {
            return { eligible: false, code: 'ALREADY_REVIEWED', message: 'Siz artıq bu tədbir üçün rəy yazmısınız.' };
        }

        // B. Free Event Check
        const isFree = event.ticketPrice === 0 || event.ticketPrice <= 0;
        if (isFree) {
            return { eligible: true, code: 'FREE_SERVICE', message: 'Pulsuz tədbirlər üçün rəy sərbəstdir.' };
        }

        // C. Booking Check
        const booking = await tx.booking.findFirst({
            where: {
                userId,
                eventId: businessId,
                status: { in: reviewConfig.allowedReviewStatuses }
            },
            include: { bookingitem: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!booking) {
            return { eligible: false, code: 'NO_BOOKING', message: 'Bu tədbir üzrə aktiv rezervasiyanız tapılmadı.' };
        }

        // D. Chronological Check
        const firstItem = booking.bookingitem?.[0];
        if (!firstItem || !firstItem.checkIn) {
            return { eligible: false, code: 'INVALID_BOOKING_STATUS', message: 'Bron detallarında xəta var.' };
        }

        const nowUtc = new Date();
        const checkInUtc = new Date(firstItem.checkIn);
        if (checkInUtc > nowUtc) {
            return { eligible: false, code: 'TRAVEL_NOT_STARTED', message: 'Səyahətiniz hələ başlamadığı üçün rəy yaza bilməzsiniz.' };
        }

        return { eligible: true, code: 'ELIGIBLE', message: 'Rəy yazmaq mümkündür.' };
    }
}

// 5. Attraction Strategy
class AttractionReviewStrategy extends ReviewEligibilityStrategy {
    async canReview(tx, userId, businessId) {
        const attraction = await tx.attraction.findUnique({
            where: { id: businessId }
        });
        if (!attraction) {
            return { eligible: false, code: 'BUSINESS_NOT_FOUND', message: 'Attraksion tapılmadı.' };
        }

        // A. Duplicate Check
        const existing = await tx.attractionreview.findFirst({
            where: { userId, attractionId: businessId }
        });
        if (existing) {
            return { eligible: false, code: 'ALREADY_REVIEWED', message: 'Siz artıq bu attraksion üçün rəy yazmısınız.' };
        }

        // B. Free Attraction Check
        const isFree = attraction.entryType === 'free' || !attraction.price || attraction.price === 0;
        if (isFree) {
            return { eligible: true, code: 'FREE_SERVICE', message: 'Pulsuz attraksionlar üçün rəy sərbəstdir.' };
        }

        // C. Booking Check
        const booking = await tx.booking.findFirst({
            where: {
                userId,
                attractionId: businessId,
                status: { in: reviewConfig.allowedReviewStatuses }
            },
            include: { bookingitem: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!booking) {
            return { eligible: false, code: 'NO_BOOKING', message: 'Bu attraksion üzrə aktiv rezervasiyanız tapılmadı.' };
        }

        // D. Chronological Check
        const firstItem = booking.bookingitem?.[0];
        if (!firstItem || !firstItem.checkIn) {
            return { eligible: false, code: 'INVALID_BOOKING_STATUS', message: 'Bron detallarında xəta var.' };
        }

        const nowUtc = new Date();
        const checkInUtc = new Date(firstItem.checkIn);
        if (checkInUtc > nowUtc) {
            return { eligible: false, code: 'TRAVEL_NOT_STARTED', message: 'Səyahətiniz hələ başlamadığı üçün rəy yaza bilməzsiniz.' };
        }

        return { eligible: true, code: 'ELIGIBLE', message: 'Rəy yazmaq mümkündür.' };
    }
}

// 6. Restaurant Strategy
class RestaurantReviewStrategy extends ReviewEligibilityStrategy {
    async canReview(tx, userId, businessId) {
        const restaurant = await tx.restaurant.findUnique({
            where: { id: businessId }
        });
        if (!restaurant) {
            return { eligible: false, code: 'BUSINESS_NOT_FOUND', message: 'Restoran tapılmadı.' };
        }

        // A. Duplicate Check
        const existing = await tx.review.findFirst({
            where: { userId, restaurantId: businessId }
        });
        if (existing) {
            return { eligible: false, code: 'ALREADY_REVIEWED', message: 'Siz artıq bu restoran üçün rəy yazmısınız.' };
        }

        return { eligible: true, code: 'ELIGIBLE', message: 'Restoranlar üçün rəy yazmaq sərbəstdir.' };
    }
}

// Strategy instance map
const strategies = {
    hotel: new HotelReviewStrategy(),
    room: new RoomReviewStrategy(),
    tour: new TourReviewStrategy(),
    event: new EventReviewStrategy(),
    attraction: new AttractionReviewStrategy(),
    restaurant: new RestaurantReviewStrategy()
};

export class ReviewEligibilityService {
    static async canReview(tx, userId, businessType, businessId) {
        const client = tx || prisma;
        const strategy = strategies[businessType];
        if (!strategy) {
            return { eligible: false, code: 'INVALID_TYPE', message: `Dəstəklənməyən xidmət növü: ${businessType}` };
        }
        return await strategy.canReview(client, userId, businessId);
    }
}
