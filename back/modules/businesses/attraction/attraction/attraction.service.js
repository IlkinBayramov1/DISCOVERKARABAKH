import { attractionRepository } from './attraction.repository.js';
import { attractionCache } from '../attraction.cache.js';
import { attractionEvents } from '../attraction.events.js';
import { ApiError } from '../../../../core/api.error.js';
import prisma from '../../../../config/db.js';
import { generateKeywords, slugify } from '../../../../core/utils/keyword.util.js';
import { eventRepository } from '../../event/event/event.repository.js';

class AttractionService {
    async createAttraction(data) {
        if (!data.slug) {
            data.slug = slugify(data.name);
        }

        if (await attractionRepository.findBySlug(data.slug)) {
            throw ApiError.badRequest(`Attraction with slug '${data.slug}' already exists`);
        }
        
        const { images, workingHours, ...rest } = data;
        
        // Auto-generate keywords
        rest.searchKeywords = generateKeywords(rest.name, rest.searchKeywords);

        const finalData = { ...rest };

        if (workingHours && workingHours.length > 0) {
            finalData.workingHours = {
                create: workingHours.map(h => ({
                    dayOfWeek: h.dayOfWeek,
                    openTime: h.openTime,
                    closeTime: h.closeTime,
                    isClosed: h.isClosed
                }))
            };
        }

        if (images && images.length > 0) {
            finalData.images = {
                create: images.map((img, index) => {
                    const url = typeof img === 'string' ? img : img.url;
                    const type = typeof img === 'string' ? 'image' : (img.type || 'image');
                    return { 
                        url, 
                        type,
                        isCover: index === 0,
                        order: index 
                    };
                })
            };
        }

        return await attractionRepository.create(finalData);
    }

    async getAttractions({ page = 1, limit = 20, categoryId, status, city, isFeatured, entryType }) {
        const skip = (page - 1) * limit;
        const take = limit;

        // Cache could realistically wrap this listing endpoint as well, 
        // but for now we prioritize exact real-time filters for lists
        return await attractionRepository.findAll(
            { categoryId, status, city, isFeatured, entryType },
            { skip, take }
        );
    }

    async getAttractionById(idOrSlug) {
        // 1. Check if ID is UUID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

        // 2. Check Redis Lazy-Load Cache
        let attraction = await attractionCache.getAttraction(idOrSlug);

        if (!attraction) {
            // 3. Cache Miss - Deep Pull from DB MySQL
            if (isUuid) {
                attraction = await attractionRepository.findById(idOrSlug);
            } else {
                attraction = await attractionRepository.findBySlug(idOrSlug);
            }
            
            if (!attraction) throw ApiError.notFound('Attraction not found');

            // 4. Populate Cache
            await attractionCache.setAttraction(idOrSlug, attraction);
        }

        // 5. Fetch Nearby Events in the same city
        if (attraction.city) {
            const nearbyEvents = await eventRepository.findAll({ city: attraction.city, status: 'active' });
            attraction.nearbyEvents = nearbyEvents;
        }

        // 6. Async Event Emission for View Stats (Non-blocking)
        attractionEvents.emit('ATTRACTION_VIEWED', { attractionId: attraction.id });

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

        const { images, workingHours, ...rest } = data;

        // Auto-generate keywords if name or keywords provided
        if (rest.name || rest.searchKeywords) {
            rest.searchKeywords = generateKeywords(rest.name || attraction.name, rest.searchKeywords || attraction.searchKeywords);
        }

        if (workingHours !== undefined) {
            // Delete all current working hours
            await prisma.attractionWorkingHour.deleteMany({
                where: { attractionId: id }
            });

            // Prepare for nested create
            rest.workingHours = {
                create: workingHours.map(h => ({
                    dayOfWeek: h.dayOfWeek,
                    openTime: h.openTime,
                    closeTime: h.closeTime,
                    isClosed: h.isClosed
                }))
            };
        }
        
        if (images !== undefined) {
            // Delete all current images
            await prisma.attractionImage.deleteMany({
                where: { attractionId: id }
            });

            // Prepare for nested create in repository.update
            rest.images = {
                create: images.map((img, index) => {
                    const url = typeof img === 'string' ? img : img.url;
                    const type = typeof img === 'string' ? 'image' : (img.type || 'image');
                    return {
                        url,
                        type,
                        isCover: index === 0,
                        order: index
                    };
                })
            };
        }

        const updated = await attractionRepository.update(id, rest);

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

    async getNearbyAttractions({ lat, lng, radiusKm, limit }) {
        return await attractionRepository.findNearby(
            parseFloat(lat), 
            parseFloat(lng), 
            radiusKm ? parseFloat(radiusKm) : 50, 
            limit ? parseInt(limit) : 5
        );
    }

    async getVendorReviews(vendorId) {
        // 1. Get all attractions owned by this vendor
        const attractions = await attractionRepository.findAll({ vendorId });
        const ids = attractions.data.map(a => a.id);
        
        if (ids.length === 0) return [];
        
        // 2. Fetch reviews for all those IDs
        const { attractionReviewRepository } = await import('../review/attractionReview.repository.js');
        return await attractionReviewRepository.findByAttractionIds(ids);
    }
}

export const attractionService = new AttractionService();
