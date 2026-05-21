import prisma from '../config/db.js';

async function syncTours() {
    console.log('--- Starting Tour Capacity Sync ---');
    
    // 1. Fetch all tours
    const tours = await prisma.tour.findMany({
        include: {
            bookings: {
                where: {
                    status: { in: ['pending_payment', 'confirmed', 'checked_in'] }
                },
                include: {
                    items: true
                }
            }
        }
    });

    console.log(`Found ${tours.length} tours to process.`);

    for (const tour of tours) {
        let totalBooked = 0;
        
        // Sum guests from all active bookings for this tour
        // Note: This logic assumes a simple 1-date tour model as per current schema
        tour.bookings.forEach(b => {
            b.items.forEach(item => {
                totalBooked += (item.adults + (item.children || 0));
            });
        });

        const availableSlots = Math.max(0, tour.groupSizeMax - totalBooked);
        
        console.log(`Tour: ${tour.name} | Max: ${tour.groupSizeMax} | Booked: ${totalBooked} | New Available: ${availableSlots}`);

        await prisma.tour.update({
            where: { id: tour.id },
            data: { availableSlots }
        });
    }

    console.log('--- Sync Completed Successfully ---');
}

syncTours()
    .catch(e => {
        console.error('Sync failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
