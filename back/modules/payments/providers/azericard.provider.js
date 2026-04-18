import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiError } from '../../../core/api.error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Azericard Provider (E-Commerce 3D Secure & AGPayDirect)
 * Implements strict RSA-SHA256 P_SIGN cryptography.
 */
export class AzericardProvider {
    constructor() {
        this.baseUrl = process.env.AZERICARD_API_URL || 'https://testmpi.3dsecure.az/cgi-bin/cgi_link';
        this.terminalId = process.env.AZERICARD_TERMINAL;
        this.merchName = process.env.AZERICARD_MERCH_NAME || 'DISCOVERKARABAKH';
        this.merchUrl = process.env.AZERICARD_MERCH_URL || process.env.FRONTEND_WEB_URL;
        
        // Load Public Key (from Bank) to VERIFY incoming responses
        try {
            const pubKeyPath = path.join(__dirname, 'bank_public.pem');
            this.publicKey = fs.readFileSync(pubKeyPath, 'utf8');
        } catch (err) {
            console.warn('[Azericard] bank_public.pem not found. Callbacks will fail signature check!');
        }

        // Load Private Key (Ours) to SIGN outgoing requests
        try {
            const privKeyPath = path.join(__dirname, 'merchant_private.pem');
            this.privateKey = fs.readFileSync(privKeyPath, 'utf8');
        } catch (err) {
            console.warn('[Azericard] merchant_private.pem not found. Outgoing requests will fail P_SIGN!');
        }
    }

    /**
     * Helper to build MAC Source String defined by Azericard
     * Rule: length_of_value + value. If empty, just append "-"
     */
    buildMacString(values) {
        return values.map(val => {
            if (val === undefined || val === null || val === '') return '-';
            const str = String(val);
            return `${str.length}${str}`;
        }).join('');
    }

    /**
     * Generate P_SIGN (RSA-SHA256 Hex) using our Private Key
     */
    generatePSign(macString) {
        if (!this.privateKey) throw ApiError.internal('merchant_private.pem is missing. Cannot sign request.');
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(macString);
        return sign.sign(this.privateKey, 'hex').toLowerCase();
    }

    /**
     * Verify Incoming P_SIGN from Bank using Bank's Public Key
     */
    verifyPSign(macString, receivedPSign) {
        if (!this.publicKey) throw ApiError.internal('bank_public.pem is missing. Cannot verify bank response.');
        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(macString);
        return verify.verify(this.publicKey, Buffer.from(receivedPSign, 'hex'));
    }

    /**
     * 1. Initiate Payment (Generates CGI Link payload)
     * For Web Integration, we actually return the Form parameters and the Frontend safely submits a POST to Azericard.
     */
    async initiate({ transactionId, amount, currency, description }) {
        console.log(`[Azericard] Generating E-Commerce request for TR: ${transactionId}`);

        const timestamp = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14); // YYYYMMDDHHMMSS
        const nonce = crypto.randomBytes(8).toString('hex'); // 16 characters hex
        const trtype = '1'; // 1 = Authorization (0 = PreAuth)
        const orderId = transactionId.replace(/-/g, '').substring(0, 30); // Azericard max length handling

        // The MAC array order for TRTYPE=1 (E-Commerce standard authorization)
        // Usually: AMOUNT, CURRENCY, TERMINAL, TRTYPE, TIMESTAMP, NONCE, MERCH_URL 
        // Note: Please adjust this array exactly as per your specific Terminal TRTYPE 1 table in Azericard.
        const macValues = [
            amount.toFixed(2), 
            currency === 'AZN' ? '944' : currency, 
            this.terminalId, 
            trtype, 
            timestamp, 
            nonce, 
            this.merchUrl
        ];

        const macString = this.buildMacString(macValues);
        const p_sign = this.generatePSign(macString);

        // We return the payload. The Frontend or our router should POST these exact values to `this.baseUrl` as a Form!
        const payload = {
            AMOUNT: amount.toFixed(2),
            CURRENCY: currency === 'AZN' ? 'AZN' : currency,
            ORDER: orderId,
            DESC: description || 'Hotel Booking',
            MERCH_NAME: this.merchName,
            MERCH_URL: this.merchUrl,
            TERMINAL: this.terminalId,
            TRTYPE: trtype,
            COUNTRY: 'AZ',
            MERCH_GMT: '+4',
            TIMESTAMP: timestamp,
            NONCE: nonce,
            BACKREF: `${process.env.BASE_URL || 'http://localhost:4004'}/api/v1/payments/callback`,
            P_SIGN: p_sign,
            // Additional parameters sent to frontend for auto-submission form
            __action: this.baseUrl
        };

        return {
            paymentUrl: `/api/v1/payments/redirect`, // You can create an endpoint that renders an HTML auto-submit form using this payload
            providerTransId: orderId,
            rawResponse: payload
        };
    }

    /**
     * 2. Verify Incoming Webhook / Redirect from Azericard
     * (Callback)
     */
    async verify(params) {
        console.log(`[Azericard] Verifying callback for Order ${params.ORDER}`);
        
        // Note: In Callback, P_SIGN check is REQUIRED!
        // MAC string for callback involves: AMOUNT, TERMINAL, APPROVAL, RRN, INT_REF
        const macValues = [
            params.AMOUNT,
            params.TERMINAL,
            params.APPROVAL,
            params.RRN,
            params.INT_REF
        ];

        const macString = this.buildMacString(macValues);
        const isValid = this.verifyPSign(macString, params.P_SIGN);

        if (!isValid) {
            throw ApiError.badRequest('Bank P_SIGN verify failed! Spoofed transaction attempted.');
        }

        // If validation passed, check the action/status
        let mappedStatus = 'pending';
        // TRTYPE 1 standard approval code is RC=00 or ACTION=0
        if (params.ACTION === '0' || params.RC === '00') {
            mappedStatus = 'success';
        } else {
            mappedStatus = 'failed';
        }

        return {
            status: mappedStatus,
            rawResponse: params
        };
    }
}
