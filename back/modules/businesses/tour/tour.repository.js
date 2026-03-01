import prisma from '../../../config/db.js';

class TourRepository {
    async create(data) {
        return prisma.tour.create({
            data,
        });
    }

    async findAll(query = {}) {
        const where = {};
        // Add filters logic if needed

        return prisma.tour.findMany({
            where,
            include: {
                owner: {
                    select: { email: true, isApproved: true }
                }
            }
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

    async findByDuration(days) {
        return prisma.tour.findMany({
            where: { durationDays: parseInt(days) }
        });
    }
}

export const tourRepository = new TourRepository();
