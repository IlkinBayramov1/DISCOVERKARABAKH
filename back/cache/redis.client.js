import { createClient } from 'redis';
import env from '../config/env.js';

let client = null;
let isConnected = false;

const initRedis = async () => {
    try {
         client = createClient({
            url: env.redisUrl,
            socket: {
                reconnectStrategy: (retries) => {
                    // Try to reconnect up to 10 times, then wait longer
                    if (retries > 10) {
                        console.warn('Redis reconnection failed after 10 attempts. Retrying in 30 seconds...');
                        return 30000;
                    }
                    console.log(`Redis reconnect attempt #${retries}...`);
                    return Math.min(retries * 500, 5000); // Exponential backoff up to 5s
                }
            }
        });

        client.on('error', (err) => {
            console.error('❌ Redis Client Error:', err.message);
            isConnected = false;
        });

        client.on('connect', () => {
            console.log('🔌 Connecting to Redis...');
        });

        client.on('ready', () => {
            console.log('✅ Redis Connected successfully!');
            isConnected = true;
        });

        client.on('end', () => {
            console.warn('❌ Redis connection closed.');
            isConnected = false;
        });

        await client.connect();
    } catch (error) {
        console.error('❌ Failed to initialize Redis client:', error.message);
        isConnected = false;
    }
};

// Initialize connection
initRedis();

export default {
    isReady: () => isConnected,
    
    get: async (key) => {
        if (!isConnected || !client) return null;
        try {
            return await client.get(key);
        } catch (err) {
            console.error(`Redis GET error for key ${key}:`, err.message);
            return null; // Graceful fallback to database
        }
    },
    
    setEx: async (key, ttl, value) => {
        if (!isConnected || !client) return null;
        try {
            return await client.setEx(key, ttl, value);
        } catch (err) {
            console.error(`Redis SETEX error for key ${key}:`, err.message);
            return null; // Graceful fallback
        }
    },
    
    del: async (key) => {
        if (!isConnected || !client) return null;
        try {
            return await client.del(key);
        } catch (err) {
            console.error(`Redis DEL error for key ${key}:`, err.message);
            return null; // Graceful fallback
        }
    },
    
    on: (event, handler) => {
        if (client) {
            client.on(event, handler);
        }
    },
    
    // Expose raw client when required (e.g. for Socket.io adapter or BullMQ connection options)
    getClient: () => {
        if (!isConnected || !client) {
            throw new Error('Redis is not connected. A running Redis connection is mandatory for this service.');
        }
        return client;
    }
};
