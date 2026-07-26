import { emailQueue, createQueueWorker } from './index.js';

/**
 * Add an email job to the queue
 * @param {object} data - { to, subject, html, text }
 */
export const addEmailJob = async (data) => {
    return await emailQueue.add('send-email', data, {
        // Prevent sending duplicate emails to the same address with the same subject in short window
        jobId: data.idempotencyKey || `email:${data.to}:${Buffer.from(data.subject).toString('base64').slice(0, 32)}`
    });
};

/**
 * Start the email worker
 * @param {function} emailSenderFn - Function that handles nodemailer / SMTP sending
 */
export const startEmailWorker = (emailSenderFn) => {
    return createQueueWorker('email-queue', async (data) => {
        await emailSenderFn(data);
    });
};
