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
            // Merging body and query to support both GET redirects and POST webhooks
            const params = { ...req.query, ...req.body };
            const updatedTx = await paymentService.handleCallback(params, req.params.provider || 'local');
            
            // In a real bank redirect, we might want to redirect the user to a success page
            if (req.method === 'GET') {
                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking/${updatedTx.bookingId}/confirmation`);
            }
            
            return successResponse(res, updatedTx, { message: 'Payment processed' });
        } catch (error) {
            next(error);
        }
    }

    // Serving the Mock Bank Page
    async renderMockBank(req, res) {
        res.sendFile(path.join(__dirname, 'views', 'mock-bank.html'));
    }
}

export const paymentController = new PaymentController();
