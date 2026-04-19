import prisma from '../config/db.js';

async function cleanupBookings() {
    console.log('--- Starting Booking Cleanup ---');

    // 1. Delete all bookings
    // Note: Due to foreign key constraints, we might need to delete items/guests first if not cascading
    // But Prisma usually handles cascade if defined in schema.
    const deletedBookings = await prisma.booking.deleteMany({});
    console.log(`Deleted ${deletedBookings.count} bookings from the system.`);

    // 2. Reset availableSlots for all tours
    const tours = await prisma.tour.findMany();
    for (const tour of tours) {
        await prisma.tour.update({
            where: { id: tour.id },
            data: { availableSlots: tour.groupSizeMax }
        });
        console.log(`Reset capacity for Tour: ${tour.name} to ${tour.groupSizeMax}`);
    }

    console.log('--- Cleanup Completed Successfully ---');
}

cleanupBookings()
    .catch(e => {
        console.error('Cleanup failed:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
