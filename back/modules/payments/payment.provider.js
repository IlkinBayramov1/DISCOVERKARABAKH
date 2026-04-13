/**
 * Base Strategy for Payment Providers
 */
export class PaymentProvider {
    /**
     * @param {Object} config - Provider specific configurations
     */
    constructor(config = {}) {
        this.config = config;
    }

    /**
     * Initiates a payment request
     * @param {Object} data - { transactionId, amount, currency, description, returnUrl, cancelUrl }
     * @returns {Promise<{paymentUrl: string, providerTransId: string, rawResponse: any}>}
     */
    async initiate(data) {
        throw new Error('Method initiate() must be implemented');
    }

    /**
     * Verifies a payment status from callback or polling
     * @param {Object} params - HTTP request params/body from bank
     * @returns {Promise<{status: 'success'|'failed'|'pending', providerTransId: string, rawResponse: any}>}
     */
    async verify(params) {
        throw new Error('Method verify() must be implemented');
    }

    /**
     * Optional: Refunds a transaction
     */
    async refund(transactionId, amount) {
        throw new Error('Method refund() not supported by this provider');
    }
}
