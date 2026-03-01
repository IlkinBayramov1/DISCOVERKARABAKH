import { Router } from 'express';
import { buyTicket, confirmPayment, cancelTicket, getEventTicketsForVendor, getMyTickets } from './ticket.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

// IMPORTANT: use mergeParams to access :eventId from the parent event.routes.js
const router = Router({ mergeParams: true });

router.use(authMiddleware);

// Endpoint: POST /api/v1/events/:eventId/tickets/buy
router.post('/buy', buyTicket);

// Endpoint: GET /api/v1/events/:eventId/tickets/mine
// Ideally this could be just /api/v1/tickets/mine but nested is fine
router.get('/mine', getMyTickets);

// Endpoint: POST /api/v1/events/:eventId/tickets/:ticketId/confirm-payment
router.post('/:ticketId/confirm-payment', confirmPayment);

// Endpoint: PATCH /api/v1/events/:eventId/tickets/:ticketId/cancel
router.patch('/:ticketId/cancel', cancelTicket);

// Vendor & Admin only: GET /api/v1/events/:eventId/tickets
router.get('/', authorize('vendor', 'admin'), getEventTicketsForVendor);

export default router;
