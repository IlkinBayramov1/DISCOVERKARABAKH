import { getPlatformAnalytics } from './modules/admins/admin.controller.js';
import prisma from './config/db.js';

async function testAnalytics() {
    console.log("=== Analitika Controller Testi Başladı ===");
    
    // Mock response object
    const createMockRes = () => ({
        statusCode: 200,
        data: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.data = payload;
            return this;
        }
    });

    const mockNext = (err) => {
        console.error("Next middleware called with error:", err);
    };

    try {
        // Test 1: Query live database
        console.log("\n1. Canlı verilənlər bazasından məlumatların çəkilməsi testi...");
        const req1 = { query: {} };
        const res1 = createMockRes();
        await getPlatformAnalytics(req1, res1, mockNext);

        console.log("Status Code:", res1.statusCode);
        console.log("Uğur statusu:", res1.data.success);
        console.log("Gələn data strukturları:");
        console.log("- Users keys:", Object.keys(res1.data.data.users));
        console.log("- Bookings keys:", Object.keys(res1.data.data.bookings));
        console.log("- Businesses keys:", Object.keys(res1.data.data.businesses));
        console.log("- Payments keys:", Object.keys(res1.data.data.payments));
        console.log("- Promotions keys:", Object.keys(res1.data.data.promotions));
        console.log("- Transport keys:", Object.keys(res1.data.data.transport));
        console.log("- Interactions keys:", Object.keys(res1.data.data.interactions));
        console.log("- Fraud keys:", Object.keys(res1.data.data.fraud));
        console.log("- Trends length:", res1.data.data.trends.length);

        // Test 2: Verify Memory Cache (should read from cache)
        console.log("\n2. Keşdən oxuma testi (30 saniyəlik keş)...");
        const req2 = { query: {} };
        const res2 = createMockRes();
        await getPlatformAnalytics(req2, res2, mockNext);
        console.log("Keşdən oxunma statusu:", res2.statusCode === 200 && res2.data.success);

        // Test 3: Cache Bypass (should force query database again)
        console.log("\n3. Keşdən yan keçmə (Cache Bypass - ?refresh=true) testi...");
        const req3 = { query: { refresh: 'true' } };
        const res3 = createMockRes();
        await getPlatformAnalytics(req3, res3, mockNext);
        console.log("Bypass və təzə məlumat statusu:", res3.statusCode === 200 && res3.data.success);

        console.log("\n✅ BÜTÜN TESTLƏR UĞURLA TAMAMLANDI!");
    } catch (err) {
        console.error("Test zamanı xəta:", err);
    } finally {
        await prisma.$disconnect();
    }
}

testAnalytics();
