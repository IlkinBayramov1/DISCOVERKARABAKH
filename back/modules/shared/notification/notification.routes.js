import { Router } from 'express';
import { getMyNotifications, markAsRead, markAllAsRead, deleteNotification } from './notification.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getMyNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
