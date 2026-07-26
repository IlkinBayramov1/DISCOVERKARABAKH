import { bookingService } from './booking.service.js';
import { successResponse } from '../../core/api.response.js';
import { ApiError } from '../../core/api.error.js';

class BookingController {
    async create(req, res, next) {
        try {
            if (['admin', 'vendor'].includes(req.user.role)) {
                return next(ApiError.forbidden('Admins and Vendors cannot make customer bookings.'));
            }

            const { type, entityId, ...data } = req.body;
            const contextInfo = {
                ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent']
            };
            const booking = await bookingService.createBooking(req.user.id, type, entityId, data, contextInfo);
            return successResponse(res, booking, { message: 'Booking initialized successfully' }, 201);
        } catch (error) {
            next(error);
        }
    }

    async preview(req, res, next) {
        try {
            const { type, entityId, ...data } = req.body;
            const previewData = await bookingService.previewPrice(req.user.id, type, entityId, data);
            return successResponse(res, previewData, { message: 'Price calculated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async lock(req, res, next) {
        try {
            const { type, entityId, ...data } = req.body;
            const lockData = await bookingService.lockInventory(req.user.id, type, entityId, data);
            return successResponse(res, lockData, { message: 'Inventory locked for checkout' });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const booking = await bookingService.getBookingById(req.params.id, req.user.id);
            return successResponse(res, booking);
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
            const bookings = await bookingService.getVendorBookings(req.user.id);
            return successResponse(res, bookings, { count: bookings.length });
        } catch (error) {
            next(error);
        }
    }

    async updateVendorBookingStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { action } = req.body; // 'approve', 'reject'
            const contextInfo = {
                ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent']
            };

            const updated = await bookingService.updateVendorBookingStatus(id, req.user.id, action, contextInfo);
            return successResponse(res, updated, { message: `Booking successfully ${action}ed` });
        } catch (error) {
            next(error);
        }
    }

    async cancel(req, res, next) {
        try {
            const contextInfo = {
                ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent']
            };
            const updated = await bookingService.cancelBooking(req.params.id, req.user.id, contextInfo);
            return successResponse(res, updated, { message: 'Booking cancelled successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export const bookingController = new BookingController();
