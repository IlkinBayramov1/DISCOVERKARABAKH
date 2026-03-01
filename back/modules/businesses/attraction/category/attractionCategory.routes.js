import { Router } from 'express';
import { attractionCategoryService } from './attractionCategory.service.js';
import { attractionCategoryValidation } from './attractionCategory.validation.js';
import { validate } from '../../../../middlewares/validate.middleware.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';
import { successResponse } from '../../../../core/api.response.js';

const router = Router();

// Public Routes
router.get('/', async (req, res, next) => {
    try {
        const categories = await attractionCategoryService.getCategories();
        return successResponse(res, categories);
    } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const category = await attractionCategoryService.getCategoryById(req.params.id);
        return successResponse(res, category);
    } catch (e) { next(e); }
});

// Admin Only Routes
router.use(authMiddleware, authorize('admin'));

router.post('/', validate(attractionCategoryValidation.createCategory), async (req, res, next) => {
    try {
        const category = await attractionCategoryService.createCategory(req.body);
        return res.status(201).json({ success: true, data: category });
    } catch (e) { next(e); }
});

router.put('/:id', validate(attractionCategoryValidation.updateCategory), async (req, res, next) => {
    try {
        const category = await attractionCategoryService.updateCategory(req.params.id, req.body);
        return successResponse(res, category);
    } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await attractionCategoryService.deleteCategory(req.params.id);
        return successResponse(res, null, { message: 'Deleted successfully' });
    } catch (e) { next(e); }
});

export default router;
