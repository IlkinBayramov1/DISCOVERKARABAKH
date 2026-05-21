import prisma from '../../../../config/db.js';
import crypto from 'crypto';

class PricingRepository {
    async create(data) {
        return prisma.ridepricing.create({
            data: {
                id: crypto.randomUUID(),
                ...data
            },
        });
    }

    async findById(id) {
        return prisma.ridepricing.findUnique({
            where: { id },
        });
    }

    async findAll() {
        return prisma.ridepricing.findMany();
    }

    async findByType(type) {
        return prisma.ridepricing.findMany({
            where: { type }
        });
    }

    async update(id, data) {
        return prisma.ridepricing.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return prisma.ridepricing.delete({
            where: { id },
        });
    }
}

export const pricingRepository = new PricingRepository();
