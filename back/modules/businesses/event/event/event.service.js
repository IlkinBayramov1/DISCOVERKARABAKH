import { eventRepository } from './event.repository.js';
import { ApiError } from '../../../../core/api.error.js';
import prisma from '../../../../config/db.js';

class EventService {
    async createEvent(userId, data) {
        // Ensure the user has a vendor profile or is an admin.
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { vendorProfile: true }
        });

        // In our system, events can only be created by users passing vendor checks (vendor or admin)
        if (user.role !== 'vendor' && user.role !== 'admin') {
            throw ApiError.forbidden('Only vendors can create events');
        }

        // Set owner to userId
        return eventRepository.create({
            vendorId: userId,
            ...data,
            status: 'active'
        });
    }

    async getEvents(filters) {
        return eventRepository.findAll(filters);
    }

    async getEventById(id) {
        const event = await eventRepository.findById(id);
        if (!event) throw ApiError.notFound('Event not found');
        return event;
    }

    async updateEvent(id, userId, role, data) {
        const event = await this.getEventById(id);

        if (role !== 'admin' && event.vendorId !== userId) {
            throw ApiError.forbidden('You do not have permission to update this event');
        }

        return eventRepository.update(id, data);
    }

    async cancelEvent(id, userId, role) {
        const event = await this.getEventById(id);

        if (role !== 'admin' && event.vendorId !== userId) {
            throw ApiError.forbidden('You do not have permission to cancel this event');
        }

        return eventRepository.update(id, { status: 'cancelled' });
    }

    async getDashboardStats(vendorUserId) {
        return eventRepository.getVendorDashboardStats(vendorUserId);
    }
}

export const eventService = new EventService();
