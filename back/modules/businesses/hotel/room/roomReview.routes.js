import { Router } from 'express';
import { roomReviewController } from './roomReview.controller.js';
import { authMiddleware } from '../../../../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

// Publicly visible reviews per room type
router.get('/', roomReviewController.getReviewsByRoom);

// Protected review creation
router.use(authMiddleware);
router.post('/', roomReviewController.create);

export default router;
