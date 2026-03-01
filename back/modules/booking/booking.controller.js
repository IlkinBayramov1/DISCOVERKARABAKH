import { bookingService } from './booking.service.js';
import { successResponse } from '../../core/api.response.js';

class BookingController {
    async create(req, res, next) {
        try {
            const { type, entityId, ...data } = req.body;
            // e.g. body: { entityId: 'uuid', type: 'hotel', items: [...], guests: [...], ... }
            const booking = await bookingService.createBooking(req.user.id, type, entityId, data);
            return successResponse(res, booking, { message: 'Booking initialized successfully' }, 201);
        } catch (error) {
            next(error);
        }
    }

    async getMine(req, res, next) {
        try {
            const bookings = await bookingService.getMyBookings(req.user.id);
            return successResponse(res, bookings, { count: bookings.length });
        } catch (error) {
            next(error);
        }
    }

    async getVendorDashboard(req, res, next) {
        try {
            // Admin can bypass, but currently restricted strictly to Vendor mapping
            const bookings = await bookingService.getVendorBookings(req.user.id);
            return successResponse(res, bookings, { count: bookings.length });
        } catch (error) {
            next(error);
        }
    }

    async cancel(req, res, next) {
        try {
            const updated = await bookingService.cancelBooking(req.params.id, req.user.id);
            return successResponse(res, updated, { message: 'Booking cancelled successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export const bookingController = new BookingController();
