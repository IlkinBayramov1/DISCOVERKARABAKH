import { attractionFavoriteRepository } from './attractionFavorite.repository.js';
import { ApiError } from '../../../../core/api.error.js';
import { attractionEvents } from '../attraction.events.js';
import prisma from '../../../../config/db.js';

class AttractionFavoriteService {
    async toggle(userId, attractionId) {
        // Validate existence
        const attraction = await prisma.attraction.findUnique({ where: { id: attractionId } });
        if (!attraction) throw ApiError.notFound('Attraction not found');

        const result = await attractionFavoriteRepository.toggleFavorite(userId, attractionId);

        // Emit Interaction Event for Stats updating asynchronously
        attractionEvents.emit('FAVORITE_TOGGLED', { attractionId, action: result.action });

        return result;
    }

    async getUserList(userId) {
        return await attractionFavoriteRepository.getUserFavorites(userId);
    }
}

export const attractionFavoriteService = new AttractionFavoriteService();
