import prisma from '../../../../config/db.js';
import crypto from 'crypto';

class CargoVehicleRepository {
    async create(data) {
        return prisma.cargovehicle.create({
            data: {
                id: crypto.randomUUID(),
                ...data
            }
        });
    }

    async findById(id) {
        return prisma.cargovehicle.findUnique({
            where: { id },
            include: {
                user: { select: { email: true, vendorprofile: { select: { companyName: true } } } }
            }
        });
    }

    async findAll(filters) {
        const { vendorId, status, cargoType, isRefrigerated } = filters;
        const where = {};
        if (vendorId) where.vendorId = vendorId;
        if (status) where.status = status;
        if (cargoType) where.cargoType = cargoType;
        if (isRefrigerated !== undefined) where.isRefrigerated = isRefrigerated === 'true';

        return prisma.cargovehicle.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { email: true, vendorprofile: { select: { companyName: true } } } }
            }
        });
    }

    async update(id, data) {
        return prisma.cargovehicle.update({
            where: { id },
            data
        });
    }

    async updateLoad(id, addedWeight, addedVolume) {
        return prisma.cargovehicle.update({
            where: { id },
            data: {
                currentLoadWeight: { increment: addedWeight },
                currentLoadVolume: { increment: addedVolume }
            }
        });
    }

    async delete(id) {
        return prisma.cargovehicle.delete({
            where: { id }
        });
    }
}

export const cargoVehicleRepository = new CargoVehicleRepository();
