import prisma from '../../../../config/db.js';
import { attractionEvents } from '../attraction.events.js';

class AttractionStatsService {
    constructor() {
        // Register Event Emitter Listeners asynchronously out of the main request
        attractionEvents.on('FAVORITE_TOGGLED', this._handleFavoriteChange.bind(this));
        attractionEvents.on('ATTRACTION_VIEWED', this._handleViewIncrement.bind(this));
        attractionEvents.on('REVIEW_CREATED', this._handleReviewChange.bind(this));
    }

    /**
     * @param {Object} payload 
     * @param {string} payload.attractionId 
     * @param {string} payload.action - 'added' | 'removed'
     */
    async _handleFavoriteChange({ attractionId, action }) {
        try {
            const incrementValue = action === 'added' ? 1 : -1;

            await prisma.attractionStat.upsert({
                where: { attractionId },
                update: {
                    favoriteCount: { increment: incrementValue }
                },
                create: {
                    attractionId,
                    favoriteCount: incrementValue > 0 ? 1 : 0
                }
            });
        } catch (error) {
            console.error('[AttractionStats] Failed to update Favorite metrics:', error);
        }
    }

    async _handleViewIncrement({ attractionId }) {
        try {
            const now = new Date();
            // Standardize to UTC Date for consistent composite key identification
            const dateStr = now.toISOString().split('T')[0];
            const date = new Date(dateStr); 
            const hour = now.getHours();

            // 1. Increment total stats (Primary key is just attractionId)
            await prisma.attractionStat.upsert({
                where: { attractionId },
                update: {
                    viewCount: { increment: 1 }
                },
                create: {
                    attractionId,
                    viewCount: 1
                }
            });

            // 2. Increment hourly stats (Composite primary key)
            // Using a separate find/update/create or robust upsert
            await prisma.attractionHourlyStat.upsert({
                where: {
                    attractionId_date_hour: {
                        attractionId,
                        date,
                        hour
                    }
                },
                update: {
                    count: { increment: 1 }
                },
                create: {
                    attractionId,
                    date,
                    hour,
                    count: 1
                }
            });
        } catch (error) {
            console.error('[AttractionStats] Failed to increment View metrics:', error);
        }
    }

    async _handleReviewChange({ attractionId }) {
        try {
            // Aggregate all reviews to get average
            const aggregation = await prisma.attractionReview.aggregate({
                where: { attractionId, status: 'approved' },
                _avg: { rating: true }
            });

            await prisma.attractionStat.upsert({
                where: { attractionId },
                update: {
                    averageRating: aggregation._avg.rating || 0
                },
                create: {
                    attractionId,
                    averageRating: aggregation._avg.rating || 0
                }
            });
        } catch (error) {
            console.error('[AttractionStats] Failed to update Review metrics:', error);
        }
    }
}

// Instantiate to register listeners instantly upon Node runtime start
export const attractionStatsService = new AttractionStatsService();
