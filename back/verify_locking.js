import { inventoryLockService } from './modules/businesses/hotel/availability/inventoryLock.service.js';
import { hotelService } from './modules/businesses/hotel/hotel/hotel.service.js';
import { bookingService } from './modules/booking/booking.service.js';
import prisma from './config/db.js';

async function verifyLocking() {
    try {
        const hotel = await prisma.hotel.findFirst({ where: { status: 'active' }, include: { roomTypes: true } });
        if (!hotel || !hotel.roomTypes.length) return console.log("No hotel found.");

        const room = hotel.roomTypes[0];
        const today = new Date();
        const start = today.toISOString().split('T')[0];
        const end = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];

        // 1. Ensure availability is set to 1 and minStay is 1 for test consistency
        await prisma.roomAvailability.update({
            where: { roomTypeId_date: { roomTypeId: room.id, date: new Date(start) } },
            data: { totalRooms: 1, reservedRooms: 0 }
        });
        await prisma.dailyPricing.update({
            where: { roomTypeId_date: { roomTypeId: room.id, date: new Date(start) } },
            data: { minStay: 1 }
        });

        console.log(`Test Room: ${room.name}, Total Inventory: 1`);

        // 2. User A acquires a lock
        console.log("User A initiating checkout (locking room)...");
        const lockRes = await bookingService.lockInventory('user-a', 'hotel', hotel.id, {
            items: [{ roomTypeId: room.id, checkIn: start, checkOut: end }]
        });
        console.log("User A Lock Status:", lockRes.locked ? "SUCCESS" : "FAILED");

        // 3. User B tries to book the same room
        console.log("User B attempting to book same room (should fail because of User A's lock)...");
        try {
            await bookingService.createBooking('user-b', 'hotel', hotel.id, {
                items: [{ roomTypeId: room.id, checkIn: start, checkOut: end }],
                guests: [],
                paymentMethod: 'Credit Card'
            });
            console.error("FAIL: User B managed to book a locked room!");
        } catch (err) {
            console.log(`SUCCESS: User B blocked. Error: ${err.message}`);
        }

        // 4. Cleanup
        await inventoryLockService.releaseLock(lockRes.lockIds[0]);
        console.log("User A's lock released.");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

verifyLocking();
