import { paymentQueue, createQueueWorker } from './index.js';

/**
 * Add a payment verification job to the queue
 * @param {object} data - { transactionId, provider }
 */
export const addPaymentJob = async (data) => {
    return await paymentQueue.add('verify-payment', data, {
        jobId: `payment:${data.transactionId}`, // Strict idempotency key
        backoff: {
            type: 'exponential',
            delay: 5000 // 5 seconds initial delay (verifications might require bank cooldowns)
        }
    });
};

/**
 * Start the payment worker
 * @param {function} paymentVerifierFn - Function that queries bank status
 */
export const startPaymentWorker = (paymentVerifierFn) => {
    return createQueueWorker('payment-queue', async (data) => {
        await paymentVerifierFn(data);
    });
};
