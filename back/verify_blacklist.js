import { fraudDetectionService } from './modules/businesses/hotel/fraud/fraud.service.js';
import prisma from './config/db.js';
import crypto from 'crypto';

async function verifyBlacklist() {
    try {
        const testEmail = "fraudster@example.com";
        const testPhone = "+994551234567";

        // 1. Create a test user
        console.log("Creating test user...");
        const user = await prisma.user.upsert({
            where: { email: testEmail },
            update: { phone: testPhone, updatedAt: new Date() },
            create: {
                id: crypto.randomUUID(),
                email: testEmail,
                password: "hashed_password",
                phone: testPhone,
                role: "user",
                updatedAt: new Date()
            }
        });

        // 2. Add email to Blacklist
        console.log(`Adding ${testEmail} to Blacklist...`);
        await prisma.blacklist.upsert({
            where: { value: testEmail },
            update: { reason: "Chargeback fraud" },
            create: {
                id: crypto.randomUUID(),
                type: "email",
                value: testEmail,
                reason: "Chargeback fraud"
            }
        });

        // 3. Evaluate Risk
        console.log("Evaluating risk for blacklisted user...");
        const riskResult = await fraudDetectionService.evaluateTransactionRisk(user.id, {
            items: [{ roomTypeId: "some-id", quantity: 1, checkIn: "2026-05-01", checkOut: "2026-05-02" }],
            totalAmount: 100
        });

        console.log("Risk Result:", riskResult);

        if (!riskResult.isApproved && riskResult.score >= 100) {
            console.log("SUCCESS: Blacklisted user correctly identified and blocked.");
        } else {
            console.error("FAIL: Blacklisted user was not blocked.");
        }

        // 4. Cleanup
        // await prisma.blacklist.delete({ where: { value: testEmail } });
        // await prisma.user.delete({ where: { id: user.id } });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

verifyBlacklist();
