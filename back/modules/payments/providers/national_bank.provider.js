import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiError } from '../../../core/api.error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * National Bank Provider (Generic skeleton for KapitalBank/PashaBank API)
 * You can paste the real Bank API logic into these methods.
 */
export class NationalBankProvider {
    constructor({ baseUrl, merchantId }) {
        this.baseUrl = baseUrl || process.env.BANK_API_URL;
        this.merchantId = merchantId || process.env.BANK_MERCHANT_ID;
        
        // Pem faylini avtomatik oxuduq
        try {
            const keyPath = path.join(__dirname, 'bank_public.pem');
            this.publicKey = fs.readFileSync(keyPath, 'utf8');
        } catch (err) {
            console.warn('[NationalBank] bank_public.pem not found or empty. Using fallback.');
            this.publicKey = process.env.BANK_SECRET_KEY;
        }
    }

    /**
     * Helper to generate Hash/Signature if the bank requires it.
     */
    generateSignature(payload) {
        // Many local banks require MD5 or SHA256 of the payload + secret string
        const dataStr = Object.values(payload).join('') + this.secretKey;
        return crypto.createHash('sha256').update(dataStr).digest('hex');
    }

    /**
     * 1. Initiate Payment
     * Called when the user clicks "Pay" on the frontend.
     * Tells the bank we want to charge X AZN, returns a URL to redirect the user to.
     */
    async initiate({ transactionId, amount, currency, description }) {
        console.log(`[NationalBank] Initiating transaction ${transactionId} for ${amount} ${currency}`);

        // Example Payload for Azerbaijani Local Bank standard:
        const payload = {
            merchant_id: this.merchantId,
            order_id: transactionId,
            amount: amount, // Maybe amount * 100 if bank needs cents/qepik
            currency: currency,
            description: description,
            success_url: `${process.env.FRONTEND_WEB_URL}/payment/success?transId=${transactionId}`,
            error_url: `${process.env.FRONTEND_WEB_URL}/payment/error?transId=${transactionId}`
        };

        // Attach security hash
        payload.signature = this.generateSignature(payload);

        try {
            /* 
             // UNCOMMENT AND EDIT THIS WHEN READY:
             const response = await fetch(`${this.baseUrl}/orders`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(payload)
             });
             const data = await response.json();
             
             if (!data.payment_url) throw new Error(data.message || 'No payment URL returned');

             return {
                 paymentUrl: data.payment_url,         // Where to redirect the user
                 providerTransId: data.bank_session_id, // Bank's internal ID
                 rawResponse: data                      // Store for logs
             };
            */

             // === MOCK RESPONSE UNTIL YOU PASTE THE REAL FETCH ABOVE ===
             return {
                 paymentUrl: `${process.env.FRONTEND_WEB_URL}/mock-bank-checkout?session=${transactionId}`,
                 providerTransId: `bank_trx_${transactionId.substring(0,8)}`,
                 rawResponse: { note: "Mock bank successful initiation" }
             };

        } catch (error) {
            throw ApiError.badRequest(`Bank API error: ${error.message}`);
        }
    }

    /**
     * 2. Verify Payment (Callback from Bank)
     */
    async verify(params) {
        const transactionId = params.transId || params.order_id;
        const psign = params.psign; // Bank sends this signature
        console.log(`[NationalBank] Verifying callback for transaction ${transactionId}`);

        try {
            // RSA Public Key verification for Bank integration
            if (this.publicKey && psign) {
                // Bank strings together the params to create the base data
                // This is an example, exactly how the bank formats the data string is in their DOCs
                const dataString = `${params.amount}${params.currency}${params.terminal}`; 
                
                // Verify the RSASSA-PKCS1-v1_5 signature using the bank's Public Key
                const isVerified = crypto.createVerify('sha256')
                    .update(dataString)
                    .verify(this.publicKey, psign, 'base64');
                    
                if (!isVerified) throw new Error("Invalid signature (psign mismatch)!");
            }

             // === MOCK VERIFY UNTIL REAL API IS ACTIVE ===
             return {
                 status: 'success', // 'success', 'failed', 'pending'
                 rawResponse: { note: "Mock bank successful verification", id: params.transId }
             };

        } catch (error) {
            throw ApiError.badRequest(`Bank Verification Error: ${error.message}`);
        }
    }
}
