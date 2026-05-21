import { calendarService } from './modules/businesses/hotel/calendar/calendar.service.js';
import prisma from './config/db.js';

async function verifyAnalytics() {
    try {
        const hotel = await prisma.hotel.findFirst({ where: { status: 'active' }, include: { roomTypes: true } });
        if (!hotel) return console.log("No hotel found.");

        const room = hotel.roomTypes[0];
        const date = new Date().toISOString().split('T')[0];

        console.log(`Test Room: ${room.name}, Total Inventory: ${room.totalInventory}`);

        // 1. Set a controlled scenario
        // Total: 10 rooms, 8 Reserved -> 80% Occupancy, Available: 2 (isLowInventory: false)
        await prisma.roomAvailability.upsert({
            where: { roomTypeId_date: { roomTypeId: room.id, date: new Date(date) } },
            update: { totalRooms: 10, availableRooms: 2, reservedRooms: 8 },
            create: { roomTypeId: room.id, date: new Date(date), totalRooms: 10, availableRooms: 2, reservedRooms: 8 }
        });

        // 2. Fetch calendar and verify
        const calendarData = await calendarService.getCalendarData(hotel.id, date, date);
        const day = calendarData[0].days[0];

        console.log(`--- Test Result ---`);
        console.log(`Reserved: ${day.reservedRooms}, Available: ${day.availableRooms}`);
        console.log(`Calculated Occupancy: ${day.occupancyRate}%`);
        console.log(`isLowInventory: ${day.isLowInventory}`);

        if (day.occupancyRate === 80 && day.isLowInventory === false) {
            console.log("SUCCESS: Analytics calculated correctly.");
        } else {
            console.error("FAIL: Analytics mismatch.");
        }

        // 3. Test Low Inventory (1 room left)
        await prisma.roomAvailability.update({
            where: { roomTypeId_date: { roomTypeId: room.id, date: new Date(date) } },
            data: { availableRooms: 1, reservedRooms: 9 }
        });

        const calendarData2 = await calendarService.getCalendarData(hotel.id, date, date);
        const day2 = calendarData2[0].days[0];
        console.log(`--- Low Inventory Test ---`);
        console.log(`Available: ${day2.availableRooms}, isLowInventory: ${day2.isLowInventory}`);

        if (day2.isLowInventory === true) {
            console.log("SUCCESS: Critical limit signal working.");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

verifyAnalytics();
