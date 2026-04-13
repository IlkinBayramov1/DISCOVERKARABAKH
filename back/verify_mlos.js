import { hotelService } from './modules/businesses/hotel/hotel/hotel.service.js';
import { calendarService } from './modules/businesses/hotel/calendar/calendar.service.js';
import { bookingService } from './modules/booking/booking.service.js';
import prisma from './config/db.js';

async function verifyMLOS() {
    try {
        const hotel = await prisma.hotel.findFirst({ where: { status: 'active' }, include: { roomTypes: true } });
        if (!hotel || !hotel.roomTypes.length) {
            console.log("No active hotels/rooms found.");
            return;
        }

        const room = hotel.roomTypes[0];
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(today.getDate() + 2);

        const startDateStr = today.toISOString().split('T')[0];
        const endDateStr = dayAfterTomorrow.toISOString().split('T')[0];

        console.log(`Setting minStay: 3 for Room: ${room.name}`);
        await calendarService.bulkUpdateCalendar(hotel.id, {
            roomTypeId: room.id,
            startDate: startDateStr,
            endDate: endDateStr,
            minStay: 3,
            basePrice: 100,
            availableRooms: 5
        });

        console.log(`Attempting 1-night booking (should fail)...`);
        try {
            await bookingService.createBooking('test-user-id', 'hotel', hotel.id, {
                items: [{
                    roomTypeId: room.id,
                    checkIn: startDateStr,
                    checkOut: tomorrow.toISOString().split('T')[0],
                    adults: 2,
                    children: 0
                }],
                guests: [],
                paymentMethod: 'Test'
            });
            console.error("FAIL: 1-night booking succeeded but should have been rejected by minStay=3.");
        } catch (err) {
            console.log(`SUCCESS: Booking rejected as expected. Error: ${err.message}`);
        }

    } catch (err) {
        console.error("Unexpected error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

verifyMLOS();
