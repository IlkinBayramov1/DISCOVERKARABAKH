import { Router } from 'express';
import { createEvent, getEvents, getEventById, updateEvent, cancelEvent, getVendorDashboard } from './event.controller.js';
import { validate } from '../../../../middlewares/validate.middleware.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';
import { createEventSchema, updateEventSchema } from './event.validation.js';

// Import nested ticket routes
import ticketRoutes from '../ticket/ticket.routes.js';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.use(authMiddleware);

// Nested routes for tickets (e.g. /events/:eventId/tickets)
router.use('/:eventId/tickets', ticketRoutes);

// Vendor & Admin only
router.get('/dashboard/stats', authorize('vendor', 'admin'), getVendorDashboard);
router.post('/', authorize('vendor', 'admin'), validate(createEventSchema), createEvent);
router.patch('/:id', authorize('vendor', 'admin'), validate(updateEventSchema), updateEvent);
router.patch('/:id/cancel', authorize('vendor', 'admin'), cancelEvent); // Specialized endpoint instead of full update

export default router;
