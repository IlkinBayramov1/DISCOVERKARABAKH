import { Queue, Worker } from 'bullmq';
import env from '../config/env.js';

let connection;
try {
    const redisUrl = new URL(env.redisUrl);
    connection = {
        host: redisUrl.hostname,
        port: parseInt(redisUrl.port) || 6379,
        username: redisUrl.username || undefined,
        password: redisUrl.password || undefined,
        tls: redisUrl.protocol === 'rediss:' ? {} : undefined,
        maxRetriesPerRequest: null // Required by BullMQ
    };
} catch (err) {
    console.warn('⚠️ Invalid Redis URL in queues config. Defaulting to localhost.');
    connection = { host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null };
}

// Queue default options
const defaultOptions = {
    connection,
    defaultJobOptions: {
        // Retry policy: 3 retries, exponential backoff (1s, 2s, 4s...)
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        },
        removeOnComplete: {
            age: 24 * 3600, // keep completed jobs for 24h
            count: 100
        },
        removeOnFail: {
            age: 7 * 24 * 3600, // keep failed jobs for 7 days (Dead Letter Queue capability)
            count: 1000
        }
    }
};

// Define Queues
export const emailQueue = new Queue('email-queue', defaultOptions);
export const smsQueue = new Queue('sms-queue', defaultOptions);
export const paymentQueue = new Queue('payment-queue', defaultOptions);
export const notificationQueue = new Queue('notification-queue', defaultOptions);

console.log('🚀 BullMQ Queues initialized with exponential retries and DLQ policies.');

/**
 * Register a worker to process tasks asynchronously
 */
export const createQueueWorker = (queueName, processor) => {
    const worker = new Worker(queueName, async (job) => {
        try {
            console.log(`[Queue Worker] Processing job ${job.id} [${queueName}]...`);
            await processor(job.data);
            console.log(`[Queue Worker] Job ${job.id} [${queueName}] completed.`);
        } catch (error) {
            console.error(`[Queue Worker] Job ${job.id} [${queueName}] failed:`, error.message);
            throw error; // Trigger BullMQ retry
        }
    }, { 
        connection,
        concurrency: 5 // Process up to 5 jobs in parallel per worker container
    });

    worker.on('failed', (job, err) => {
        console.error(`🚨 [Queue Worker Alert] Job ${job ? job.id : 'unknown'} [${queueName}] failed:`, err.message);
        if (job && job.attemptsMade >= job.opts.attempts) {
            console.error(`💀 [Dead Letter Queue] Job ${job.id} [${queueName}] has failed all retry attempts.`);
        }
    });

    return worker;
};
export { connection };
