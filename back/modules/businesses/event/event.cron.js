import cron from 'node-cron';
import prisma from '../../../config/db.js';

export const startEventJobs = () => {
    // Run every hour to check for expired events
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();

            // 1. Find all active events whose endDate has passed
            const expiredEvents = await prisma.event.findMany({
                where: {
                    status: 'active',
                    endDate: { lt: now }
                },
                select: { id: true }
            });

            if (expiredEvents.length === 0) {
                return;
            }

            const eventIds = expiredEvents.map(e => e.id);

            // 2. Wrap status updates in a transaction
            await prisma.$transaction(async (tx) => {
                // Update events to completed
                await tx.event.updateMany({
                    where: { id: { in: eventIds } },
                    data: { status: 'completed' }
                });

                // Update their active tickets to expired
                // NOTE: 'used' tickets remain 'used', 'cancelled' remain 'cancelled'
                await tx.ticket.updateMany({
                    where: {
                        eventId: { in: eventIds },
                        status: 'active'
                    },
                    data: { status: 'expired' }
                });
            });

            console.log(`✅ Event Expiration Job finished. Completed ${eventIds.length} events and expired their unused active tickets.`);
        } catch (error) {
            console.error('❌ Error in Event Expiration Job:', error.message);
        }
    });
};
