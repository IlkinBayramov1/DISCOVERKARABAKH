import { attractionRepository } from './attraction.repository.js';
import { attractionCache } from '../attraction.cache.js';
import { attractionEvents } from '../attraction.events.js';
import { ApiError } from '../../../../core/api.error.js';

class AttractionService {
    async createAttraction(data) {
        if (await attractionRepository.findBySlug(data.slug)) {
            throw ApiError.badRequest(`Attraction with slug '${data.slug}' already exists`);
        }
        return await attractionRepository.create(data);
    }

    async getAttractions({ page = 1, limit = 20, categoryId, status, isFeatured, entryType }) {
        const skip = (page - 1) * limit;
        const take = limit;

        // Cache could realistically wrap this listing endpoint as well, 
        // but for now we prioritize exact real-time filters for lists
        return await attractionRepository.findAll(
            { categoryId, status, isFeatured, entryType },
            { skip, take }
        );
    }

    async getAttractionById(id) {
        // 1. Check Redis Lazy-Load Cache
        let attraction = await attractionCache.getAttraction(id);

        if (!attraction) {
            // 2. Cache Miss - Deep Pull from DB MySQL
            attraction = await attractionRepository.findById(id);
            if (!attraction) throw ApiError.notFound('Attraction not found');

            // 3. Populate Cache
            await attractionCache.setAttraction(id, attraction);
        }

        // 4. Async Event Emission for View Stats (Non-blocking)
        attractionEvents.emit('ATTRACTION_VIEWED', { attractionId: id });

        return attraction;
    }

    async updateAttraction(id, data) {
        const attraction = await attractionRepository.findById(id);
        if (!attraction) throw ApiError.notFound('Attraction not found');

        if (data.slug && data.slug !== attraction.slug) {
            if (await attractionRepository.findBySlug(data.slug)) {
                throw ApiError.badRequest('Attraction slug must be unique');
            }
        }

        const updated = await attractionRepository.update(id, data);

        // Invalidate stale Cache
        await attractionCache.invalidateAttraction(id);

        return updated;
    }

    async deleteAttraction(id) {
        const attraction = await attractionRepository.findById(id);
        if (!attraction) throw ApiError.notFound('Attraction not found');

        await attractionRepository.delete(id);
        await attractionCache.invalidateAttraction(id);

        return true;
    }
}

export const attractionService = new AttractionService();
