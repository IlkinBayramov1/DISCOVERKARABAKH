import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';

class CalendarNoteService {
    async createNote(hotelId, data) {
        return prisma.hotelCalendarNote.upsert({
            where: {
                hotelId_date: {
                    hotelId,
                    date: new Date(data.date)
                }
            },
            update: {
                note: data.note,
                type: data.type || "info"
            },
            create: {
                hotelId,
                date: new Date(data.date),
                note: data.note,
                type: data.type || "info"
            }
        });
    }

    async getNotesInRange(hotelId, startDate, endDate) {
        return prisma.hotelCalendarNote.findMany({
            where: {
                hotelId,
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            }
        });
    }

    async deleteNote(hotelId, date) {
        return prisma.hotelCalendarNote.delete({
            where: {
                hotelId_date: {
                    hotelId,
                    date: new Date(date)
                }
            }
        });
    }
}

export const calendarNoteService = new CalendarNoteService();
