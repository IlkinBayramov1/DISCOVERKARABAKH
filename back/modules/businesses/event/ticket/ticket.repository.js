import prisma from '../../../../config/db.js';

class TicketRepository {
    async createTicket(data) {
        return prisma.ticket.create({ data });
    }

    async findById(ticketId) {
        return prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { event: true } // Need event data for cancellation rules
        });
    }

    async findUserTickets(userId) {
        return prisma.ticket.findMany({
            where: { userId },
            include: { event: { select: { title: true, startDate: true, location: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findEventTickets(eventId) {
        return prisma.ticket.findMany({
            where: { eventId },
            include: { user: { select: { email: true } } }
        });
    }

    async updateTicketStatus(ticketId, status) {
        return prisma.ticket.update({
            where: { id: ticketId },
            data: { status }
        });
    }
}

export const ticketRepository = new TicketRepository();
