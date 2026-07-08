import prisma from '../config/db.js';

async function test() {
    try {
        console.log("Testing Transactions Query with Search...");
        const search = "";
        const where = {};
        if (search) {
            where.OR = [
                { id: { contains: search } },
                { providerTransId: { contains: search } },
                { booking: { bookingNumber: { contains: search } } },
                { booking: { user: { email: { contains: search } } } }
            ];
        }
        const count = await prisma.paymenttransaction.count({ where });
        const transactions = await prisma.paymenttransaction.findMany({
            where,
            include: {
                booking: {
                    select: {
                        bookingNumber: true,
                        totalPrice: true,
                        currency: true,
                        user: { select: { email: true } }
                    }
                }
            },
            take: 10
        });
        console.log("Transactions query success! Count:", count, "Loaded:", transactions.length);
    } catch (error) {
        console.error("Transactions query failed:", error);
    }

    try {
        console.log("Testing User Wallet Stats Query...");
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                balance: true,
                createdAt: true
            }
        });
        const userIds = users.map(u => u.id);
        const [walletTransactions, cardTransactions] = await Promise.all([
            prisma.wallettransaction.findMany({
                where: {
                    userId: { in: userIds },
                    status: 'COMPLETED'
                }
            }),
            prisma.paymenttransaction.findMany({
                where: {
                    booking: { userId: { in: userIds } },
                    status: 'completed',
                    provider: { not: 'wallet' }
                },
                include: {
                    booking: { select: { userId: true } }
                }
            })
        ]);
        console.log("User wallet stats query success! Users count:", users.length, "Wallet Tx:", walletTransactions.length, "Card Tx:", cardTransactions.length);
    } catch (error) {
        console.error("User wallet stats query failed:", error);
    }

    process.exit(0);
}

test();
