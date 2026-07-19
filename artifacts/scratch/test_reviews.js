import prisma from '../../back/config/db.js';
import { ReviewEligibilityService } from '../../back/modules/interactions/review/reviewEligibility.service.js';
import { getAllReviews } from '../../back/modules/admins/admin.controller.js';
import crypto from 'crypto';

async function runTests() {
    console.log('--- REVIEW ELIGIBILITY & MODERATION TEST SUITE ---');

    // 1. Create a dummy user
    const userId = `test-user-${crypto.randomInt(100000, 999999)}`;
    const email = `${userId}@example.com`;
    console.log(`Creating dummy user: ${email}`);
    await prisma.user.create({
        data: {
            id: userId,
            email,
            password: 'hashedpassword',
            role: 'user',
            isActive: true,
            isApproved: true,
            firstName: 'Test',
            lastName: 'User',
            updatedAt: new Date()
        }
    });

    // 2. Create a dummy hotel
    const hotelId = `test-hotel-${crypto.randomInt(100000, 999999)}`;
    console.log(`Creating dummy hotel: ${hotelId}`);
    await prisma.hotel.create({
        data: {
            id: hotelId,
            name: 'Test Hotel',
            description: 'A great test hotel',
            address: '123 Test St',
            phone: '123-456-7890',
            email: 'hotel@test.com',
            ownerId: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    try {
        // --- Test Scenario 1: No Booking ---
        console.log('\n[Scenario 1] Testing review eligibility without any booking...');
        const eligibility1 = await ReviewEligibilityService.canReview(prisma, userId, 'hotel', hotelId);
        console.log(`Result: eligible = ${eligibility1.eligible}, code = ${eligibility1.code}, message = "${eligibility1.message}"`);
        if (eligibility1.eligible || eligibility1.code !== 'NO_BOOKING') {
            throw new Error('Scenario 1 failed: Expected NO_BOOKING');
        }

        // --- Test Scenario 2: Future Check-in Date ---
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 24); // 24 hours in the future
        console.log(`\n[Scenario 2] Creating booking with FUTURE check-in date: ${futureDate.toISOString()}`);
        
        const bookingId1 = `booking-${crypto.randomInt(100000, 999999)}`;
        await prisma.booking.create({
            data: {
                id: bookingId1,
                userId,
                hotelId,
                status: 'confirmed',
                totalPrice: 100,
                bookingNumber: `BK-${crypto.randomInt(100000, 999999)}`,
                bookingType: 'hotel',
                entityId: hotelId,
                vendorId: userId,
                updatedAt: new Date(),
                bookingitem: {
                    create: {
                        id: `item-${crypto.randomInt(100000, 999999)}`,
                        price: 100,
                        checkIn: futureDate,
                        checkOut: new Date(futureDate.getTime() + 24 * 3600000)
                    }
                }
            }
        });

        const eligibility2 = await ReviewEligibilityService.canReview(prisma, userId, 'hotel', hotelId);
        console.log(`Result: eligible = ${eligibility2.eligible}, code = ${eligibility2.code}, message = "${eligibility2.message}"`);
        if (eligibility2.eligible || eligibility2.code !== 'TRAVEL_NOT_STARTED') {
            throw new Error('Scenario 2 failed: Expected TRAVEL_NOT_STARTED');
        }

        // --- Test Scenario 3: Valid Booking (Past Check-in Date) ---
        const pastDate = new Date();
        pastDate.setHours(pastDate.getHours() - 2); // 2 hours in the past
        console.log(`\n[Scenario 3] Creating booking with PAST check-in date: ${pastDate.toISOString()}`);
        
        const bookingId2 = `booking-${crypto.randomInt(100000, 999999)}`;
        await prisma.booking.create({
            data: {
                id: bookingId2,
                userId,
                hotelId,
                status: 'confirmed',
                totalPrice: 100,
                bookingNumber: `BK-${crypto.randomInt(100000, 999999)}`,
                bookingType: 'hotel',
                entityId: hotelId,
                vendorId: userId,
                updatedAt: new Date(),
                bookingitem: {
                    create: {
                        id: `item-${crypto.randomInt(100000, 999999)}`,
                        price: 100,
                        checkIn: pastDate,
                        checkOut: new Date(pastDate.getTime() + 24 * 3600000)
                    }
                }
            }
        });

        const eligibility3 = await ReviewEligibilityService.canReview(prisma, userId, 'hotel', hotelId);
        console.log(`Result: eligible = ${eligibility3.eligible}, code = ${eligibility3.code}, message = "${eligibility3.message}"`);
        if (!eligibility3.eligible) {
            throw new Error('Scenario 3 failed: Expected ELIGIBLE');
        }

        // --- Test Scenario 4: Duplicate Review Check ---
        console.log('\n[Scenario 4] Creating review and testing duplicate check...');
        await prisma.review.create({
            data: {
                id: `review-${crypto.randomInt(100000, 999999)}`,
                userId,
                hotelId,
                rating: 5,
                comment: 'Excellent hotel!',
                status: 'approved',
                updatedAt: new Date()
            }
        });

        const eligibility4 = await ReviewEligibilityService.canReview(prisma, userId, 'hotel', hotelId);
        console.log(`Result: eligible = ${eligibility4.eligible}, code = ${eligibility4.code}, message = "${eligibility4.message}"`);
        if (eligibility4.eligible || eligibility4.code !== 'ALREADY_REVIEWED') {
            throw new Error('Scenario 4 failed: Expected ALREADY_REVIEWED');
        }

        console.log('\nAll scenarios completed successfully!');

    } finally {
        console.log('\nCleaning up database records...');
        // Clean up created entities
        await prisma.review.deleteMany({ where: { userId } });
        await prisma.bookingitem.deleteMany({ where: { booking: { userId } } });
        await prisma.booking.deleteMany({ where: { userId } });
        await prisma.hotel.delete({ where: { id: hotelId } });
        await prisma.user.delete({ where: { id: userId } });
        console.log('Cleanup completed.');
    }
}

runTests().catch(err => {
    console.error('Test Suite Failed:', err);
    process.exit(1);
});
