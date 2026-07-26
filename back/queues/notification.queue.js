import { notificationQueue, createQueueWorker } from './index.js';

/**
 * Add a notification job to the queue
 * @param {object} data - { userId, title, message, type }
 */
export const addNotificationJob = async (data) => {
    return await notificationQueue.add('send-notification', data, {
        jobId: data.idempotencyKey || `notification:${data.userId}:${Date.now()}`
    });
};

/**
 * Start the notification worker
 * @param {function} notificationSenderFn - Function that broadcasts notifications / sends push messages
 */
export const startNotificationWorker = (notificationSenderFn) => {
    return createQueueWorker('notification-queue', async (data) => {
        await notificationSenderFn(data);
    });
};
