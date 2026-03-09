import { Router } from 'express';
import { calendarController } from './calendar.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true }); // Access :hotelId from parent

// Protected Vendor & Admin Routes
router.use(authMiddleware);

// Get calendar data for a specific date range
router.get('/', authorize('vendor', 'admin'), calendarController.getCalendarData);

// Bulk update calendar (pricing and availability)
router.post('/bulk-update', authorize('vendor', 'admin'), calendarController.bulkUpdate);

export default router;
