import cron from 'node-cron';
import prisma from '../../../config/db.js';

/**
 * Kommunal Ödəniş Sistemi üçün arxa plan işlərini (cron jobs) başlatmaq.
 */
export const startUtilityJobs = () => {
    console.log(' [NODE-CRON] Utility Billing notification jobs started.');

    // Hər gün saat 09:00-da son ödəniş tarixinə 3 gün qalmış borcları yoxlayıb bildiriş göndərmək
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log('[NODE-CRON] Running daily utility bill reminder scan...');
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 3);

            const startOfTarget = new Date(targetDate.setHours(0, 0, 0, 0));
            const endOfTarget = new Date(targetDate.setHours(23, 59, 59, 999));

            // Son ödəniş tarixinə 3 gün qalan ödənilməmiş borcları tapırıq
            const approachingBills = await prisma.utilitybill.findMany({
                where: {
                    status: { in: ['unpaid', 'partially_paid'] },
                    dueDate: {
                        gte: startOfTarget,
                        lte: endOfTarget
                    }
                },
                include: {
                    abonent: true
                }
            });

            console.log(`[NODE-CRON] Found ${approachingBills.length} bills expiring in 3 days.`);

            for (const bill of approachingBills) {
                const abonent = bill.abonent;
                const remainingAmount = bill.amount - bill.paidAmount;

                // Əgər abonent sistemdə qeydiyyatlı istifadəçidirsə
                if (abonent && abonent.userId) {
                    const user = await prisma.user.findUnique({
                        where: { id: abonent.userId }
                    });

                    if (user && user.phone) {
                        console.log(`[SMS Reminder] Sent to ${user.firstName} ${user.lastName} (${user.phone}): Sizin abonent kodu (${abonent.abonentCode}) üzrə ${remainingAmount} AZN dəyərində ${bill.utilityType} borcunuzun son ödəniş tarixinə 3 gün qalmışdır.`);
                    }
                    if (user && user.email) {
                        console.log(`[Email Reminder] Sent to ${user.email}: Sizin ${bill.utilityType} borcunuz üçün xəbərdarlıq məktubu.`);
                    }
                }
            }
        } catch (error) {
            console.error('[NODE-CRON] Error running daily utility bill reminder:', error);
        }
    });
};
