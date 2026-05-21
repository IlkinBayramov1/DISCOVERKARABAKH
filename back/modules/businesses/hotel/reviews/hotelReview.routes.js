import { Router } from 'express';
import { hotelReviewController } from './hotelReview.controller.js';
import { authMiddleware } from '../../../../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

// Publicly visible reviews per hotel
router.get('/', hotelReviewController.getReviewsByHotel);

// Protected review creation (enforces ownership and checkout validation natively in service)
router.use(authMiddleware);
router.post('/', hotelReviewController.create);

export default router;
