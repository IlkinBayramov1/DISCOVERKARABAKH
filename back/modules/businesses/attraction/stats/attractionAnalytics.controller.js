import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';
import { successResponse } from '../../../../core/api.response.js';

class AttractionAnalyticsController {
    /**
     * Get deep analytics for a specific attraction.
     * Shows hourly and daily distribution of views.
     */
    async getDeepAnalytics(req, res, next) {
        try {
            const { id } = req.params;
            const { days = 90 } = req.query; // Default to 3 months as requested

            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(days));

            const stats = await prisma.attractionHourlyStat.findMany({
                where: {
                    attractionId: id,
                    date: { gte: startDate }
                }
            });

            // 1. Hourly Distribution (0-23)
            const hourlyDistribution = Array(24).fill(0);
            // 2. Daily Distribution (0-6, where 0 is Sunday)
            const dailyDistribution = Array(7).fill(0);
            
            let totalViews = 0;

            stats.forEach(stat => {
                const count = stat.count;
                totalViews += count;

                // Hourly
                hourlyDistribution[stat.hour] += count;

                // Daily (Week Day)
                const dayOfWeek = new Date(stat.date).getDay();
                dailyDistribution[dayOfWeek] += count;
            });

            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const formattedDaily = dailyDistribution.map((count, index) => ({
                day: dayNames[index],
                count
            }));

            const formattedHourly = hourlyDistribution.map((count, hour) => ({
                hour,
                count
            }));

            return successResponse(res, {
                totalViews,
                periodDays: parseInt(days),
                hourlyDistribution: formattedHourly,
                dailyDistribution: formattedDaily
            });
        } catch (error) {
            next(error);
        }
    }
}

export const attractionAnalyticsController = new AttractionAnalyticsController();
