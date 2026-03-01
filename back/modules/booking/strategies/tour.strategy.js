import { BookingStrategy } from '../booking.strategy.js';
import prisma from '../../../config/db.js';
import { ApiError } from '../../../core/api.error.js';

export class TourBookingStrategy extends BookingStrategy {
    async validateAvailability(data) {
        const { businessId, tourDetails } = data;

        const tour = await prisma.tour.findUnique({ where: { id: businessId } });
        if (!tour) throw ApiError.notFound('Tour not found');

        // Note: Real enterprise logic checks `participants` against `tour.groupSizeMax` 
        // across all existing active bookings for this particular `tourDate`.

        return { tour, tourDetails };
    }

    async calculatePrice(context, data) {
        const { tour, tourDetails } = context;
        return tour.pricePerPerson * tourDetails.participants;
    }

    async generateDetailsPayload(context, data) {
        const { tourDetails } = context;
        return tourDetails; // { tourDate, participants }
    }
}
