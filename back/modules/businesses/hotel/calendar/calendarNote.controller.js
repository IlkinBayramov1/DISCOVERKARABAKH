import { calendarNoteService } from './calendarNote.service.js';
import { successResponse } from '../../../../core/api.response.js';

class CalendarNoteController {
    async createNote(req, res, next) {
        try {
            const { hotelId } = req.params;
            const note = await calendarNoteService.createNote(hotelId, req.body);
            return successResponse(res, note, { message: 'Note saved successfully' });
        } catch (error) {
            next(error);
        }
    }

    async getNotes(req, res, next) {
        try {
            const { hotelId } = req.params;
            const { startDate, endDate } = req.query;
            const notes = await calendarNoteService.getNotesInRange(hotelId, startDate, endDate);
            return successResponse(res, notes);
        } catch (error) {
            next(error);
        }
    }

    async deleteNote(req, res, next) {
        try {
            const { hotelId } = req.params;
            const { date } = req.query;
            await calendarNoteService.deleteNote(hotelId, date);
            return successResponse(res, null, { message: 'Note deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export const calendarNoteController = new CalendarNoteController();
