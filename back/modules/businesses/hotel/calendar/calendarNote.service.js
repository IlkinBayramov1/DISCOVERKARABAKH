import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';
import crypto from 'crypto';

class CalendarNoteService {
    async createNote(hotelId, data) {
        return prisma.hotelcalendarnote.upsert({
            where: {
                hotelId_date: {
                    hotelId,
                    date: new Date(data.date)
                }
            },
            update: {
                note: data.note,
                type: data.type || "info",
                updatedAt: new Date()
            },
            create: {
                id: crypto.randomUUID(),
                hotelId,
                date: new Date(data.date),
                note: data.note,
                type: data.type || "info",
                updatedAt: new Date()
            }
        });
    }

    async getNotesInRange(hotelId, startDate, endDate) {
        return prisma.hotelcalendarnote.findMany({
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
        return prisma.hotelcalendarnote.delete({
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
