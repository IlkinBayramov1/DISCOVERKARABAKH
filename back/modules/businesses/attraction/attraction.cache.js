import redisClient from '../../../cache/redis.client.js';

class AttractionCache {
    constructor() {
        this.PREFIX = 'attraction:';
        this.TTL = 3600; // 1 hour lazy evaluation lock
    }

    async getAttraction(id) {
        if (!redisClient.isReady()) return null;
        try {
            const data = await redisClient.get(`${this.PREFIX}${id}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('[AttractionCache] Redis GET error:', error);
            return null;
        }
    }

    async setAttraction(id, data) {
        if (!redisClient.isReady()) return;
        try {
            await redisClient.setEx(`${this.PREFIX}${id}`, this.TTL, JSON.stringify(data));
        } catch (error) {
            console.error('[AttractionCache] Redis SET error:', error);
        }
    }

    async invalidateAttraction(id) {
        if (!redisClient.isReady()) return;
        try {
            await redisClient.del(`${this.PREFIX}${id}`);
        } catch (error) {
            console.error('[AttractionCache] Redis DEL error:', error);
        }
    }
}

export const attractionCache = new AttractionCache();
