import { Router } from 'express';
import attractionRoutes from './attraction/attraction.routes.js';
import attractionCategoryRoutes from './category/attractionCategory.routes.js';
import { attractionFavoriteService } from './favorite/attractionFavorite.service.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import { successResponse } from '../../../core/api.response.js';

const router = Router();

// 1. Core Categories
router.use('/categories', attractionCategoryRoutes);

// 2. Core Attractions (Which include stats/lazy caching inherently)
router.use('/', attractionRoutes);

// 3. Isolated Interaction Modules (Favorites)
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
