import prisma from '../../../../config/db.js';

class AttractionPopularityService {

    /**
     * A Cron-based nightly job or event-driven calculator.
     * Evaluates a popularityScore blending recent views, average rating weights, and favorites.
     */
    async recalculateAlgorithmScoring(attractionId) {
        try {
            const stats = await prisma.attractionStat.findUnique({
                where: { attractionId }
            });

            if (!stats) return;

            // Simple MVP Weightings
            const viewWeight = stats.viewCount * 0.1;
            const favoriteWeight = stats.favoriteCount * 2.5;
            const ratingWeight = stats.averageRating * 5.0;

            const popularityScore = viewWeight + favoriteWeight + ratingWeight;

            await prisma.attractionStat.update({
                where: { attractionId },
                data: { popularityScore }
            });

        } catch (error) {
            console.error(`[AttractionPopularity] Recalculation failed for ${attractionId}:`, error);
        }
    }
}

export const attractionPopularityService = new AttractionPopularityService();
