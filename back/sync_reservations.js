import prisma from './config/db.js';

async function syncReservations() {
    console.log('Fetching all non-cancelled bookings...');
    const activeBookings = await prisma.booking.findMany({
        where: {
            status: { in: ['draft', 'pending', 'confirmed'] },
            bookingType: 'hotel'
        },
        include: { items: true }
    });

    console.log(`Found ${activeBookings.length} active hotel bookings.`);

    // Reset all reservedRooms to 0 first to be safe
    await prisma.roomAvailability.updateMany({
        where: {},
        data: { reservedRooms: 0 }
    });

    console.log('Reset roomAvailability.reservedRooms to 0.');

    let incrementCount = 0;
    for (const booking of activeBookings) {
        if (booking.items && booking.items.length > 0) {
            for (const item of booking.items) {
                // Determine duration
                let current = new Date(item.checkIn);
                const end = new Date(item.checkOut);

                while (current < end) {
                    const result = await prisma.roomAvailability.updateMany({
                        where: {
                            roomTypeId: item.roomTypeId,
                            date: current
                        },
                        data: {
                            reservedRooms: { increment: 1 }
                        }
                    });
                    if (result.count > 0) incrementCount++;
                    current.setDate(current.getDate() + 1);
                }
            }
        }
    }
    console.log(`Successfully applied ${incrementCount} room-night locks to RoomAvailability.`);
}

syncReservations()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
