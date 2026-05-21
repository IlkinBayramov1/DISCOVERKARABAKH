import prisma from '../../../../config/db.js';

class EventRepository {
    async create(data) {
        return prisma.event.create({
            data
        });
    }

    async findById(id) {
        return prisma.event.findUnique({
            where: { id },
            include: {
                owner: { select: { id: true, email: true, vendorProfile: true } }
            }
        });
    }

    async findAll(filters) {
        const { vendorId, status, category, city } = filters;
        const where = {};
        if (vendorId) where.vendorId = vendorId;
        if (status) where.status = status;
        if (category) where.category = category;
        if (city) where.city = city;

        return prisma.event.findMany({
            where,
            orderBy: { startDate: 'asc' }
        });
    }

    async update(id, data) {
        return prisma.event.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        // Soft delete or just update status to cancelled? We'll update status to cancelled in service, but if hard delete needed:
        return prisma.event.delete({
            where: { id }
        });
    }

    // Dashboard Aggregations
    // Aggregating revenue directly from the tickets belonging to a vendor's events
    async getVendorDashboardStats(vendorId) {
        // Total Revenue & Active tickets across all vendor events
        const ticketStats = await prisma.ticket.aggregate({
            where: {
                event: { vendorId },
                status: { in: ['active', 'used'] }
            },
            _sum: {
                price: true
            },
            _count: {
                id: true
            }
        });

        const cancelledTickets = await prisma.ticket.count({
            where: {
                event: { vendorId },
                status: 'cancelled'
            }
        });

        const events = await prisma.event.findMany({
            where: { vendorId }
        });

        // Calculate overall capacity to find occupancy rate
        const totalCapacity = events.reduce((sum, ev) => sum + ev.capacity, 0);
        const soldCount = ticketStats._count.id || 0;
        const occupancyRate = totalCapacity > 0 ? ((soldCount / totalCapacity) * 100).toFixed(2) : 0;

        return {
            totalRevenue: ticketStats._sum.price || 0,
            activeAndUsedTickets: soldCount,
            cancelledTickets,
            occupancyRate: `${occupancyRate}%`,
            totalEvents: events.length
        };
    }
}

export const eventRepository = new EventRepository();
