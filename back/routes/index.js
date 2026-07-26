import { Router } from 'express';
import v1Routes from './v1/index.js';
import prisma from '../config/db.js';
import redisClient from '../cache/redis.client.js';

const router = Router();

// Healthcheck Route checking both DB and Redis
router.get('/health', async (req, res) => {
    let dbStatus = 'healthy';
    let redisStatus = 'healthy';
    let statusCode = 200;

    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch (err) {
        dbStatus = `unhealthy: ${err.message}`;
        statusCode = 500;
    }

    if (!redisClient.isReady()) {
        redisStatus = 'unhealthy: not connected';
        statusCode = 500;
    }

    res.status(statusCode).json({
        status: statusCode === 200 ? 'UP' : 'DOWN',
        timestamp: new Date(),
        database: dbStatus,
        redis: redisStatus
    });
});

router.use('/api/v1', v1Routes);

export default router;
