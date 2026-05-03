import { Router } from 'express';
import { getProfile, updateProfile } from './user.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateProfileSchema } from './user.validation.js';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);

// Favorites
import favoriteController from '../shared/favorite/favorite.controller.js';
router.get('/favorites', favoriteController.getMyFavorites);
router.post('/favorites/toggle', favoriteController.toggleFavorite);

export default router;
