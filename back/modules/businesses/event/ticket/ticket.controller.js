import { ticketService } from './ticket.service.js';

export const buyTicket = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const ticket = await ticketService.initiatePurchase(eventId, req.user.id);

        res.status(201).json({
            success: true,
            message: 'Ticket initiated and pending payment',
            data: ticket
        });
    } catch (error) {
        next(error);
    }
};

export const confirmPayment = async (req, res, next) => {
    try {
        const { ticketId } = req.params;
        const { paymentId } = req.body; // Mocked payment response

        const activeTicket = await ticketService.confirmPayment(ticketId, paymentId);

        res.status(200).json({
            success: true,
            message: 'Payment confirmed. Ticket is now active.',
            data: activeTicket
        });
    } catch (error) {
        next(error);
    }
};

export const cancelTicket = async (req, res, next) => {
    try {
        const { ticketId } = req.params;
        const ticket = await ticketService.cancelTicket(ticketId, req.user.id, req.user.role);

        res.status(200).json({
            success: true,
            message: 'Ticket cancelled successfully',
            data: ticket
        });
    } catch (error) {
        next(error);
    }
};

export const getMyTickets = async (req, res, next) => {
    try {
        // Note: getMyTickets doesn't strictly need eventId from params since it gets all user tickets,
        // but if requested via /events/... we might filter. 
        // Usually "my tickets" is a global endpoint for the user. We'll return all tickets for the user.
        const tickets = await ticketService.getUserTickets(req.user.id);
        res.status(200).json({ success: true, count: tickets.length, data: tickets });
    } catch (error) {
        next(error);
    }
};

export const getEventTicketsForVendor = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const tickets = await ticketService.getEventTickets(eventId, req.user.id, req.user.role);

        res.status(200).json({ success: true, count: tickets.length, data: tickets });
    } catch (error) {
        next(error);
    }
};
