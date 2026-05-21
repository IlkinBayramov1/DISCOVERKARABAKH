import { Router } from 'express';
import { attractionAnalyticsController } from './attractionAnalytics.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

// Only vendors or admins should see deep analytics
router.get(
    '/',
    authMiddleware,
    authorize('vendor', 'admin'),
    attractionAnalyticsController.getDeepAnalytics
);

export default router;
