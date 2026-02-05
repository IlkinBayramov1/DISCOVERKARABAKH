import { Router } from 'express';
import {
    getAllUsers,
    deleteUser,
    banUser,
    unbanUser,
    approveUser,
    rejectUser
} from './admin.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import roleMiddleware from '../../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Governance
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);
router.patch('/users/:id/approve', approveUser);
router.patch('/users/:id/reject', rejectUser);

export default router;
