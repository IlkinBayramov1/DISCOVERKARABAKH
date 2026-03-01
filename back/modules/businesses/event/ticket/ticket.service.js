import { ticketRepository } from './ticket.repository.js';
import { ApiError } from '../../../../core/api.error.js';
import prisma from '../../../../config/db.js';

class TicketService {
    // 1. Initiate Purchase (Creates Pending Ticket)
    async initiatePurchase(eventId, userId) {
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) throw ApiError.notFound('Event not found');
        if (event.status !== 'active') throw ApiError.badRequest('Event is not active');

        // Preliminary check without lock, just so user doesn't waste time if 100% sold out already
        if (event.soldCount >= event.capacity) {
            throw ApiError.badRequest('Event is already sold out');
        }

        // Create pending ticket (e.g. going to payment gateway)
        const ticket = await ticketRepository.createTicket({
            eventId,
            userId,
            price: event.ticketPrice,
            status: 'pending'
        });

        return ticket;
    }

    // 2. Confirm Payment & Concurrency Lock (Atomic)
    async confirmPayment(ticketId, paymentId) {
        return await prisma.$transaction(async (tx) => {
            const ticket = await tx.ticket.findUnique({
                where: { id: ticketId },
                include: { event: true }
            });

            if (!ticket) throw ApiError.notFound('Ticket not found');
            if (ticket.status !== 'pending') throw ApiError.badRequest('Ticket is not pending payment');

            const event = ticket.event;

            // Ensure we don't exceed capacity safely with DB-level lock logic
            const updatedEvent = await tx.event.updateMany({
                where: {
                    id: event.id,
                    soldCount: { lt: event.capacity } // DB-level constraint!
                },
                data: {
                    soldCount: { increment: 1 }
                }
            });

            // If no rows were updated, it means the condition `soldCount < capacity` failed exactly at runtime
            if (updatedEvent.count === 0) {
                // Here normally we would trigger a refund via payment gateway
                await tx.ticket.update({
                    where: { id: ticketId },
                    data: { status: 'cancelled', cancelledAt: new Date() }
                });
                throw ApiError.badRequest('Sold out: Transaction failed due to capacity reach. Refund initiated.');
            }

            // If capacity update succeeded, activate the ticket
            const activeTicket = await tx.ticket.update({
                where: { id: ticketId },
                data: {
                    status: 'active',
                    paymentId: paymentId || `pay_${Date.now()}`,
                    purchasedAt: new Date(),
                    qrCode: `QR_${ticketId}_${Date.now()}` // Mock generation
                }
            });

            return activeTicket;
        });
    }

    // 3. Cancel Ticket with Time Rule (< 24 hrs)
    async cancelTicket(ticketId, userId, role) {
        return await prisma.$transaction(async (tx) => {
            const ticket = await tx.ticket.findUnique({
                where: { id: ticketId },
                include: { event: true }
            });

            if (!ticket) throw ApiError.notFound('Ticket not found');
            if (ticket.userId !== userId && role !== 'admin') {
                throw ApiError.forbidden('You do not own this ticket');
            }
            if (ticket.status !== 'active') {
                throw ApiError.badRequest('Only active tickets can be cancelled');
            }

            const event = ticket.event;
            const now = new Date();
            const hoursToStart = (new Date(event.startDate).getTime() - now.getTime()) / (1000 * 60 * 60);

            // Rule: Cannot cancel if less than 24 hours to the event start
            if (hoursToStart < 24) {
                throw ApiError.badRequest('Cannot cancel a ticket less than 24 hours before the event starts');
            }

            // Decrement soldCount since ticket is becoming inactive
            await tx.event.update({
                where: { id: event.id },
                data: { soldCount: { decrement: 1 } }
            });

            // Mark cancelled
            const updatedTicket = await tx.ticket.update({
                where: { id: ticketId },
                data: {
                    status: 'cancelled',
                    cancelledAt: now
                }
            });

            return updatedTicket;
        });
    }

    async getUserTickets(userId) {
        return ticketRepository.findUserTickets(userId);
    }

    async getEventTickets(eventId, userId, role) {
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) throw ApiError.notFound('Event not found');

        // Only creator vendor or admin can see all event tickets
        if (role !== 'admin' && event.vendorId !== userId) {
            throw ApiError.forbidden('Unauthorized to view event tickets');
        }

        return ticketRepository.findEventTickets(eventId);
    }
}

export const ticketService = new TicketService();
