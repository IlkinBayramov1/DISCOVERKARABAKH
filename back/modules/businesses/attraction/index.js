import { Router } from 'express';
import attractionRoutes from './attraction/attraction.routes.js';
import { attractionFavoriteService } from './favorite/attractionFavorite.service.js';
import { attractionStatsService } from './stats/attractionStats.service.js';
import attractionAnalyticsRoutes from './stats/attractionAnalytics.routes.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import { successResponse } from '../../../core/api.response.js';
import attractionReviewRoutes from './review/attractionReview.routes.js';
import { attractionController } from './attraction/attraction.controller.js';
import { validate } from '../../../middlewares/validate.middleware.js';
import { attractionValidation } from './attraction/attraction.validation.js';

const router = Router();

// 1. Core Categories (Static Enum based)
const ATTRACTION_CATEGORIES = [
    { id: 'Muzey', name: 'Muzey' },
    { id: 'Park', name: 'Park' },
    { id: 'Tarixi_Mekan', name: 'Tarixi Məkan' },
    { id: 'Tebiet_Abidesi', name: 'Təbiət Abidəsi' },
    { id: 'Memorial_Kompleks', name: 'Memorial Kompleks' },
    { id: 'Idman_Eylence', name: 'İdman və Əyləncə' }
];

router.get('/categories', (req, res) => {
    return successResponse(res, ATTRACTION_CATEGORIES);
});

router.get('/nearby', validate(attractionValidation.nearbyQuery, 'query'), attractionController.getNearby.bind(attractionController));

// 2. Global Review Management (Must be before parametric /:id/reviews)
router.get('/reviews', authMiddleware, attractionController.getVendorReviews.bind(attractionController));

// 3. Isolated Interaction Modules
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
