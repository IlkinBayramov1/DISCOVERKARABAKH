import prisma from '../../../config/db.js';

class TourRepository {
    async create(data) {
        return prisma.tour.create({
            data: {
                ...data,
                availableSlots: data.groupSizeMax
            },
        });
    }

    async findAll(query = {}) {
        const {
            city,
            ownerId,
            minPrice,
            maxPrice,
            difficulty,
            durationDays,
            limit = 10,
            page = 1
        } = query;

        const where = {};
        if (city) where.city = city;
        if (ownerId) where.ownerId = ownerId;
        if (difficulty) where.difficulty = difficulty;
        if (durationDays) where.durationDays = parseInt(durationDays);

        if (minPrice || maxPrice) {
            where.pricePerPerson = {};
            if (minPrice) where.pricePerPerson.gte = parseFloat(minPrice);
            if (maxPrice) where.pricePerPerson.lte = parseFloat(maxPrice);
        }

        return prisma.tour.findMany({
            where,
            include: {
                owner: {
                    select: { email: true, isApproved: true }
                }
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id) {
        return prisma.tour.findUnique({
            where: { id },
            include: {
                owner: {
                    select: { email: true, isApproved: true }
                }
            }
        });
    }

    async findBySlug(slug) {
        return prisma.tour.findUnique({
            where: { slug },
            include: {
                owner: {
                    select: { email: true, isApproved: true }
                }
            }
        });
    }

    async update(id, data) {
        return prisma.tour.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return prisma.tour.delete({
            where: { id },
        });
    }

    async countBookedParticipants(tourId, date) {
        const bookings = await prisma.booking.findMany({
            where: {
                tourId,
                status: { in: ['pending_payment', 'confirmed', 'checked_in'] },
                items: {
                    some: {
                        checkIn: new Date(date)
                    }
                }
            },
            include: {
                items: true
            }
        });

        let total = 0;
        bookings.forEach(b => {
            b.items.forEach(item => {
                if (new Date(item.checkIn).getTime() === new Date(date).getTime()) {
                    total += (item.adults + (item.children || 0));
                }
            });
        });

        return total;
    }

    async decrementAvailableSlots(tourId, count, tx) {
        const client = tx || prisma;
        return client.tour.update({
            where: { id: tourId },
            data: {
                availableSlots: {
                    decrement: count
                }
            }
        });
    }

    async incrementAvailableSlots(tourId, count, tx) {
        const client = tx || prisma;
        return client.tour.update({
            where: { id: tourId },
            data: {
                availableSlots: {
                    increment: count
                }
            }
        });
    }
}

export const tourRepository = new TourRepository();
