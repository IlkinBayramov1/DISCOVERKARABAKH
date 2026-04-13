import { Router } from 'express';
import { blacklistController } from './blacklist.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

const router = Router();

// Blacklist management is restricted to Admin only
router.use(authMiddleware);
router.use(authorize('admin'));

router.get('/', blacklistController.getBlacklist);
router.get('/risk-logs', blacklistController.getRiskLogs);
router.post('/', blacklistController.addToBlacklist);
router.delete('/:id', blacklistController.removeFromBlacklist);

export default router;
