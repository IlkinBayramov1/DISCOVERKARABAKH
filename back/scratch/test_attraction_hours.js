import prisma from '../config/db.js';
import { bookingService } from '../modules/booking/booking.service.js';

async function testAttractionHours() {
    console.log('--- STARTING ATTRACTION HOURS VALIDATION TEST ---');
    
    try {
        // 1. Find the test attraction
        let attraction = await prisma.attraction.findFirst({
            where: { name: 'Test Paid Attraction' }
        });
        
        if (!attraction) {
            console.log('Test attraction not found. Please run seed script first.');
            return;
        }

        console.log(`Using attraction: ${attraction.name} (ID: ${attraction.id})`);

        // 2. Set Monday as CLOSED
        console.log('Ensuring Monday is set as CLOSED in DB...');
        await prisma.attractionWorkingHour.upsert({
            where: { attractionId_dayOfWeek: { attractionId: attraction.id, dayOfWeek: 1 } },
            update: { isClosed: true },
            create: { attractionId: attraction.id, dayOfWeek: 1, isClosed: true }
        });

        // 3. Find a user
        const user = await prisma.user.findFirst();
        
        // 4. Find the NEXT Monday
        const now = new Date();
        const nextMonday = new Date();
        nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
        if (nextMonday.toDateString() === now.toDateString()) {
            nextMonday.setDate(nextMonday.getDate() + 7);
        }
        
        console.log(`Attempting to book for the next Monday: ${nextMonday.toDateString()}`);

        try {
            await bookingService.createBooking(
                user.id,
                'attraction',
                attraction.id,
                {
                    visitDate: nextMonday,
                    participants: 1,
                    paymentMethod: 'Test'
                }
            );
            console.error('FAIL: Booking on a closed day should have been BLOCKED!');
        } catch (error) {
            console.log('SUCCESS: Booking was correctly blocked.');
            console.log('Error Message:', error.message);
        }

        // 5. Test a day that is OPEN
        const nextTuesday = new Date(nextMonday);
        nextTuesday.setDate(nextTuesday.getDate() + 1);
        console.log(`Attempting to book for the next Tuesday (assuming open): ${nextTuesday.toDateString()}`);

        try {
            const booking = await bookingService.createBooking(
                user.id,
                'attraction',
                attraction.id,
                {
                    visitDate: nextTuesday,
                    participants: 1,
                    paymentMethod: 'Test'
                }
            );
            console.log('SUCCESS: Booking on an open day was ALLOWED.');
            console.log('Booking Number:', booking.bookingNumber);
        } catch (error) {
            console.error('FAIL: Booking on an open day should have been allowed.');
            console.error('Error:', error);
        }

    } catch (error) {
        console.error('Unexpected Test Error:', error);
    } finally {
        await prisma.$disconnect();
        console.log('--- TEST FINISHED ---');
    }
}

testAttractionHours();
