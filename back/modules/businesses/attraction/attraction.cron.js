import cron from 'node-cron';
import prisma from '../../../config/db.js';

/**
 * Starts background jobs for the Attraction module.
 */
export const startAttractionJobs = () => {
    // 1. Cleanup old hourly stats (Retention: 90 days)
    // Runs every day at 03:00 AM
    cron.schedule('0 3 * * *', async () => {
        try {
            console.log('[AttractionCron] Starting Analytics Cleanup Job...');
            
            const retentionDate = new Date();
            retentionDate.setDate(retentionDate.getDate() - 90);

            const deleted = await prisma.attractionHourlyStat.deleteMany({
                where: {
                    date: { lt: retentionDate }
                }
            });

            console.log(`[AttractionCron] Cleanup finished. Deleted ${deleted.count} old hourly stat records.`);
        } catch (error) {
            console.error('[AttractionCron] Error in Analytics Cleanup Job:', error.message);
        }
    });
};
