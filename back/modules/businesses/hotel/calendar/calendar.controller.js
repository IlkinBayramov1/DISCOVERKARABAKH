import { calendarService } from './calendar.service.js';
import { ApiError } from '../../../../core/api.error.js';

class CalendarController {

    // GET /api/v1/hotels/:hotelId/calendar?startDate=2026-03-01&endDate=2026-03-31
    async getCalendarData(req, res, next) {
        try {
            const { hotelId } = req.params;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                throw ApiError.badRequest('startDate and endDate query parameters are required');
            }

            const data = await calendarService.getCalendarData(hotelId, startDate, endDate);

            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/v1/hotels/:hotelId/calendar/bulk-update
    async bulkUpdate(req, res, next) {
        try {
            const { hotelId } = req.params;
            const updatePayload = req.body;

            // Optional: check if the hotel actually belongs to the user here or in service

            await calendarService.bulkUpdateCalendar(hotelId, updatePayload);

            res.status(200).json({
                success: true,
                message: 'Calendar updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

export const calendarController = new CalendarController();
