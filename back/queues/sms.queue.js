import { smsQueue, createQueueWorker } from './index.js';

/**
 * Add an SMS job to the queue
 * @param {object} data - { phone, message }
 */
export const addSmsJob = async (data) => {
    return await smsQueue.add('send-sms', data, {
        jobId: data.idempotencyKey || `sms:${data.phone}:${Date.now()}`
    });
};

/**
 * Start the SMS worker
 * @param {function} smsSenderFn - Function that interfaces with SMS API provider
 */
export const startSmsWorker = (smsSenderFn) => {
    return createQueueWorker('sms-queue', async (data) => {
        await smsSenderFn(data);
    });
};
