import { Router } from 'express';
import { addReview, getBusinessReviews } from './review.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import roleMiddleware from '../../../middlewares/role.middleware.js';

const router = Router({ mergeParams: true });
// mergeParams needed if we nest routes (e.g. /tours/:businessId/reviews), 
// but here we might use independent /reviews?businessId or /reviews/:businessId
// Let's stick to independent for simplicity or query param.

// Route: /api/v1/reviews
router.get('/:businessId', getBusinessReviews);

router.use(authMiddleware);
router.post('/', roleMiddleware(['user', 'tourist', 'resident', 'investor', 'admin']), addReview);

export default router;
