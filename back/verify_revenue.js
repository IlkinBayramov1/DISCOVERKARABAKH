import { pricingEngine } from './modules/businesses/hotel/pricing/pricing.engine.js';
import { revenueService } from './modules/businesses/hotel/pricing/revenue.service.js';
import prisma from './config/db.js';

async function verifyRevenueManagement() {
    try {
        const hotel = await prisma.hotel.findFirst({ where: { status: 'active' }, include: { roomTypes: true } });
        if (!hotel || !hotel.roomTypes.length) return console.log("No hotel found.");

        const room = hotel.roomTypes[0];
        
        // Find a Friday or Saturday
        const friday = new Date('2026-04-17'); // April 17, 2026 is a Friday
        const saturday = new Date('2026-04-18');
        
        const start = friday.toISOString().split('T')[0];
        const end = saturday.toISOString().split('T')[0];

        // 1. Ensure clean state for the test date
        await prisma.dailyPricing.upsert({
            where: { roomTypeId_date: { roomTypeId: room.id, date: friday } },
            update: { basePrice: 100, minStay: 1, isStopped: false },
            create: { roomTypeId: room.id, date: friday, basePrice: 100 }
        });

        // Ensure no conflicting rules exist
        await prisma.pricingRule.deleteMany({ where: { hotelId: hotel.id } });

        console.log(`Original Price for Friday: 100 AZN`);

        // 2. Calculate price WITHOUT rules
        const priceBefore = await pricingEngine.calculateStayPrice({
            entityId: hotel.id,
            items: [{ roomTypeId: room.id, checkIn: start, checkOut: end }]
        });
        console.log(`Price before rule: ${priceBefore.grossTotal} AZN`);

        // 3. Create a Weekend Markup rule (+20%)
        console.log("Creating Weekend Markup rule (+20% on Fri/Sat)...");
        await revenueService.createRule(hotel.id, {
            name: "Weekend Special",
            type: "WEEKEND",
            adjustment: "PERCENTAGE",
            value: 20,
            daysOfWeek: "Fri,Sat",
            isActive: true
        });

        // 4. Calculate price WITH rule
        const priceAfter = await pricingEngine.calculateStayPrice({
            entityId: hotel.id,
            items: [{ roomTypeId: room.id, checkIn: start, checkOut: end }]
        });
        
        console.log(`Price after rule: ${priceAfter.grossTotal} AZN`);

        if (priceAfter.grossTotal === 120) {
            console.log("SUCCESS: Revenue Management rule applied correctly (100 + 20% = 120)");
        } else {
            console.error(`FAIL: Expected 120, got ${priceAfter.grossTotal}`);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

verifyRevenueManagement();
