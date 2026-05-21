import { paymentService } from './payment.service.js';
import { successResponse } from '../../core/api.response.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class PaymentController {
    async initiate(req, res, next) {
        try {
            const { bookingId, provider } = req.body;
            const transaction = await paymentService.initiatePayment(bookingId, req.user.id, provider);
            return successResponse(res, transaction, { message: 'Payment initialized' });
        } catch (error) {
            next(error);
        }
    }

    async callback(req, res, next) {
        try {
            console.log(`[Payment] Callback received. Method: ${req.method}, Provider: ${req.params.provider}`);
            const params = { ...req.query, ...req.body };
            console.log('[Payment] Callback Params:', params);

            const updatedTx = await paymentService.handleCallback(params, req.params.provider || 'local');
            console.log('[Payment] Transaction updated successfully. Status:', updatedTx.status);

            const frontendUrl = process.env.FRONTEND_WEB_URL || 'http://localhost:5173';
            const redirectUrl = `${frontendUrl}/booking-confirmation/${updatedTx.bookingId}`;
            
            console.log(`[Payment] Redirecting user to: ${redirectUrl}`);

            // If it's a browser request (likely our mock bank or a real redirect), send 302
            if (req.accepts('html') || req.method === 'POST' || req.method === 'GET') {
                return res.redirect(redirectUrl);
            }
            
            return successResponse(res, updatedTx, { message: 'Payment processed' });
        } catch (error) {
            console.error('[Payment] Callback Error:', error);
            next(error);
        }
    }

    // Serving the Mock Bank Page
    async renderMockBank(req, res) {
        res.sendFile(path.join(__dirname, 'views', 'mock-bank.html'));
    }
}

export const paymentController = new PaymentController();
