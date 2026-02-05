import { Router } from 'express';
import { getProfile, updateProfile } from './user.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
