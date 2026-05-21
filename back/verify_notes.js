import { calendarNoteService } from './modules/businesses/hotel/calendar/calendarNote.service.js';
import { calendarService } from './modules/businesses/hotel/calendar/calendar.service.js';
import prisma from './config/db.js';

async function verifyDailyNotes() {
    try {
        const hotel = await prisma.hotel.findFirst({ where: { status: 'active' } });
        if (!hotel) return console.log("No hotel found.");

        const date = new Date().toISOString().split('T')[0];
        const nextDay = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];

        console.log(`Creating note for ${date}...`);
        await calendarNoteService.createNote(hotel.id, {
            date: date,
            note: "City Marathon - High Demand Expected!",
            type: "event"
        });

        console.log("Fetching calendar data to verify note integration...");
        const calendarData = await calendarService.getCalendarData(hotel.id, date, nextDay);
        
        // Find the day in the first room type's days array
        const dayWithNote = calendarData[0].days.find(d => d.date === date);

        if (dayWithNote && dayWithNote.note) {
            console.log("SUCCESS: Note found in calendar data:", dayWithNote.note);
        } else {
            console.error("FAIL: Note not found in calendar data.");
        }

        // Cleanup
        // await calendarNoteService.deleteNote(hotel.id, date);
        // console.log("Test note deleted.");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

verifyDailyNotes();
