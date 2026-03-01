import locationRepository from './location.repository.js';
import { ApiError } from '../../../../core/api.error.js';
// Using redis directly. If the redis client is not in config, we can use a stub structure until connected.
import { createClient } from 'redis';

// For actual production, import from a central 'config/redis.js'
let redisClient;
try {
    redisClient = createClient({
        socket: { reconnectStrategy: false } // Disable retry loop to prevent terminal spam
    });
    redisClient.on('error', (err) => { /* Suppress continuous error logging */ });
    // Do not 'await connected' here to avoid blocking startup if redis is offline. 
    redisClient.connect().catch(() => { });
} catch (e) {
    console.error("Redis connection failed to initialize in Location Service");
}


class LocationService {
    async search(query) {
        if (!query || query.trim().length === 0) {
            return [];
        }

        return await locationRepository.searchLocations(query.trim());
    }

    async incrementPopularity(locationId) {
        // Redisson Counter approach to prevent MySQL locks during high traffic
        try {
            const loc = await locationRepository.findById(locationId);
            if (!loc) return false;

            if (redisClient && redisClient.isOpen) {
                await redisClient.incr(`location:${locationId}:popularity`);
                // Note: A separate Node-Cron job would historically dump these keys into MySQL every 5 mins.
            } else {
                // Fallback to DB if Redis is unreachable
                const prisma = (await import('../../../../config/db.js')).default;
                await prisma.location.update({
                    where: { id: parseInt(locationId) },
                    data: { popularity: { increment: 1 } }
                });
            }
            return true;
        } catch (error) {
            console.error("Increment Popularity Error:", error);
            return false;
        }
    }
}

export default new LocationService();
