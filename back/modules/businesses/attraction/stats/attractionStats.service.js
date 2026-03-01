import prisma from '../../../../config/db.js';
import { attractionEvents } from '../attraction.events.js';

class AttractionStatsService {
    constructor() {
        // Register Event Emitter Listeners asynchronously out of the main request
        attractionEvents.on('FAVORITE_TOGGLED', this._handleFavoriteChange.bind(this));
        attractionEvents.on('ATTRACTION_VIEWED', this._handleViewIncrement.bind(this));
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
        } catch (error) {
            console.error('[AttractionStats] Failed to increment View metrics:', error);
        }
    }
}

// Instantiate to register listeners instantly upon Node runtime start
export const attractionStatsService = new AttractionStatsService();
