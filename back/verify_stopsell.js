import { calendarService } from './modules/businesses/hotel/calendar/calendar.service.js';
import { bookingService } from './modules/booking/booking.service.js';
import prisma from './config/db.js';

async function verifyStopSell() {
    try {
        const hotel = await prisma.hotel.findFirst({ where: { status: 'active' }, include: { roomTypes: true } });
        if (!hotel || !hotel.roomTypes.length) return console.log("No hotel found.");

        const room = hotel.roomTypes[0];
        const date = new Date().toISOString().split('T')[0];
        const checkout = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

        // Ensure clean state
        await prisma.roomType.update({ where: { id: room.id }, data: { isActive: true } });
        await calendarService.bulkUpdateCalendar(hotel.id, {
            roomTypeId: room.id,
            startDate: date,
            endDate: date,
            isStopped: false,
            basePrice: 100,
            availableRooms: 5
        });

        console.log(`Test 1: Global Deactivation (isActive: false)`);
        await prisma.roomType.update({ where: { id: room.id }, data: { isActive: false } });
        try {
            await bookingService.createBooking('test-user', 'hotel', hotel.id, {
                items: [{ roomTypeId: room.id, checkIn: date, checkOut: checkout }],
                guests: [], paymentMethod: 'Test'
            });
            console.error("FAIL: Booking succeeded for inactive RoomType.");
        } catch (err) {
            console.log(`SUCCESS: Global block works. Error: ${err.message}`);
        }

        console.log(`\nTest 2: Date-specific Stop Sell (isStopped: true)`);
        await prisma.roomType.update({ where: { id: room.id }, data: { isActive: true } });
        await calendarService.bulkUpdateCalendar(hotel.id, {
            roomTypeId: room.id,
            startDate: date,
            endDate: date,
            isStopped: true
        });
        try {
            await bookingService.createBooking('test-user', 'hotel', hotel.id, {
                items: [{ roomTypeId: room.id, checkIn: date, checkOut: checkout }],
                guests: [], paymentMethod: 'Test'
            });
            console.error("FAIL: Booking succeeded for stopped date.");
        } catch (err) {
            console.log(`SUCCESS: Date block works. Error: ${err.message}`);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

verifyStopSell();
