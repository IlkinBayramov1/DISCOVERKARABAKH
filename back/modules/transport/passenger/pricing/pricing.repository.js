import prisma from '../../../../config/db.js';

class PricingRepository {
    async create(data) {
        return prisma.ridePricing.create({
            data,
        });
    }

    async findById(id) {
        return prisma.ridePricing.findUnique({
            where: { id },
        });
    }

    async findAll() {
        return prisma.ridePricing.findMany();
    }

    async findByType(type) {
        return prisma.ridePricing.findMany({
            where: { type }
        });
    }

    async update(id, data) {
        return prisma.ridePricing.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return prisma.ridePricing.delete({
            where: { id },
        });
    }
}

export const pricingRepository = new PricingRepository();
