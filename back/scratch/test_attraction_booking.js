import prisma from '../config/db.js';
import { bookingService } from '../modules/booking/booking.service.js';

async function testAttractionBooking() {
    console.log('--- STARTING ATTRACTION BOOKING TEST ---');
    
    try {
        // 1. Find a paid attraction
        const attraction = await prisma.attraction.findFirst({
            where: { entryType: 'paid' }
        });
        
        if (!attraction) {
            console.log('No paid attraction found. Please create one first.');
            return;
        }
        console.log(`Found paid attraction: ${attraction.name} (ID: ${attraction.id}, Price: ${attraction.price})`);

        // 2. Find a user
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log('No user found.');
            return;
        }
        console.log(`Using user: ${user.email} (ID: ${user.id})`);

        // 3. Create a booking
        const bookingData = {
            visitDate: new Date(Date.now() + 86400000 * 2), // 2 days in future
            participants: 3,
            guests: [
                { firstName: 'Test', lastName: 'Guest 1', email: 'guest1@test.com' },
                { firstName: 'Test', lastName: 'Guest 2', email: 'guest2@test.com' }
            ],
            paymentMethod: 'Test Simulation'
        };

        console.log('Creating booking...');
        const booking = await bookingService.createBooking(
            user.id,
            'attraction',
            attraction.id,
            bookingData
        );

        console.log('Booking created successfully!');
        console.log('Booking Details:', JSON.stringify(booking, null, 2));

        // 4. Verify in DB
        const verifiedBooking = await prisma.booking.findUnique({
            where: { id: booking.id },
            include: { items: true, guests: true, attraction: true }
        });
        
        console.log('--- DB VERIFICATION ---');
        console.log('Relation Check (attraction name):', verifiedBooking.attraction?.name);
        console.log('Items Count:', verifiedBooking.items.length);
        console.log('Guests Count:', verifiedBooking.guests.length);
        console.log('Total Price:', verifiedBooking.totalPrice);

    } catch (error) {
        console.error('Test FAILED:', error);
    } finally {
        await prisma.$disconnect();
        console.log('--- TEST FINISHED ---');
    }
}

testAttractionBooking();
