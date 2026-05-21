import { calendarService } from './modules/businesses/hotel/calendar/calendar.service.js';
import prisma from './config/db.js';

async function verifyPriceOffset() {
    try {
        const hotel = await prisma.hotel.findFirst({ where: { status: 'active' }, include: { roomTypes: true } });
        if (!hotel) return console.log("No hotel found.");

        const room = hotel.roomTypes[0];
        const date = new Date().toISOString().split('T')[0];

        // 1. Set initial price to 100
        console.log(`Setting initial price for ${date} to 100 AZN...`);
        await calendarService.bulkUpdateCalendar(hotel.id, {
            roomTypeId: room.id,
            startDate: date,
            endDate: date,
            basePrice: 100
        });

        // 2. Apply a 15% increase
        console.log("Applying 15% bulk increase...");
        await calendarService.bulkUpdateCalendar(hotel.id, {
            roomTypeId: room.id,
            startDate: date,
            endDate: date,
            priceAdjustment: { type: 'percentage', value: 15 }
        });

        // 3. Verify
        const calendarData = await calendarService.getCalendarData(hotel.id, date, date);
        const day = calendarData[0].days[0];

        console.log(`New Price: ${day.basePrice} AZN`);
        
        if (day.basePrice === 115) {
            console.log("SUCCESS: Price offset/+15% applied correctly.");
        } else {
            console.error(`FAIL: Expected 115, got ${day.basePrice}`);
        }

        // 4. Verify restriction indicators
        console.log("Testing restriction indicators (setting minStay: 2)...");
        await calendarService.bulkUpdateCalendar(hotel.id, {
            roomTypeId: room.id,
            startDate: date,
            endDate: date,
            minStay: 2
        });

        const calendarData2 = await calendarService.getCalendarData(hotel.id, date, date);
        const day2 = calendarData2[0].days[0];
        
        console.log(`hasRestrictions: ${day2.hasRestrictions}, activeRestrictions: ${day2.activeRestrictions}`);
        if (day2.hasRestrictions && day2.activeRestrictions.includes('MLOS')) {
            console.log("SUCCESS: Restriction indicators working.");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

verifyPriceOffset();
