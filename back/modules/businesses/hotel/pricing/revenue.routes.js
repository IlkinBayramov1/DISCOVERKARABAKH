import express from 'express';
import { revenueController } from './revenue.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true });

// All rules are managed by vendors/admins
router.use(authMiddleware);
router.use(authorize('vendor', 'admin'));

router.get('/', revenueController.getRules);
router.post('/', revenueController.createRule);
router.patch('/:ruleId', revenueController.updateRule);
router.delete('/:ruleId', revenueController.deleteRule);

export default router;
