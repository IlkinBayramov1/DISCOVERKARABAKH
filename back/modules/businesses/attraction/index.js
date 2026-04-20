import { Router } from 'express';
import attractionRoutes from './attraction/attraction.routes.js';
import attractionCategoryRoutes from './category/attractionCategory.routes.js';
import { attractionFavoriteService } from './favorite/attractionFavorite.service.js';
import { attractionStatsService } from './stats/attractionStats.service.js';
import attractionAnalyticsRoutes from './stats/attractionAnalytics.routes.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import { successResponse } from '../../../core/api.response.js';
import attractionReviewRoutes from './review/attractionReview.routes.js';

const router = Router();

// 1. Core Categories
router.use('/categories', attractionCategoryRoutes);

// 2. Isolated Interaction Modules (Reviews must be BEFORE general attraction routes to avoid auth middleware)
router.use('/:id/reviews', attractionReviewRoutes);
router.use('/:id/analytics', attractionAnalyticsRoutes);

// 3. Core Attractions
router.use('/', attractionRoutes);

router.post('/:id/favorite', authMiddleware, async (req, res, next) => {
    try {
        const result = await attractionFavoriteService.toggle(req.user.id, req.params.id);
        return successResponse(res, result, { message: `Attraction ${result.action} to favorites` });
    } catch (error) {
        next(error);
    }
});

// 4. (Future) Reviews mounting
// router.use('/:id/reviews', authMiddleware, reviewRoutes);

export default router;
