import { PaymentProvider } from '../payment.provider.js';
import crypto from 'crypto';

/**
 * Mock Bank Provider for Local Development
 */
export class LocalBankProvider extends PaymentProvider {
    constructor(config) {
        super(config);
        this.baseUrl = config.baseUrl || 'http://localhost:4004'; // Updated to 4004
    }

    /**
     * @param {Object} data - { transactionId, amount, currency, returnUrl }
     */
    async initiate(data) {
        const { transactionId, amount, currency } = data;
        
        // Simulating bank's internal transaction ID
        const providerTransId = 'MOCK-BANK-' + crypto.randomBytes(4).toString('hex').toUpperCase();

        // The URL the user should be redirected to
        // We pass the transactionId and providerId so the mock page knows what it's paying for
        const paymentUrl = `${this.baseUrl}/api/v1/payments/mock-bank?transId=${transactionId}&amount=${amount}&currency=${currency}`;

        return {
            paymentUrl,
            providerTransId,
            rawResponse: { status: 'INITIALIZED', generatedAt: new Date() }
        };
    }

    /**
     * @param {Object} params - The data sent back from the mock page or webhook
     */
    async verify(params) {
        const { status, providerTransId } = params;

        // In a real bank, we would verify the signature here.
        // In local mock, we trust the status passed (success/failed)
        return {
            status: status === 'approved' ? 'success' : 'failed',
            providerTransId,
            rawResponse: params
        };
    }
}
