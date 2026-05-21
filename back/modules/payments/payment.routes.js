import { Router } from 'express';
import { paymentController } from './payment.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Mock Bank UI - Accessible without auth for simulation
router.get('/mock-bank', paymentController.renderMockBank);

// Initialization - Requires Auth
router.post('/initiate', authMiddleware, paymentController.initiate);

// Callback - Generic handler for provider responses
router.all('/callback/:provider', paymentController.callback);

export default router;
