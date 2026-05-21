import prisma from '../../../../config/db.js';

class CargoVehicleRepository {
    async create(data) {
        return prisma.cargoVehicle.create({ data });
    }

    async findById(id) {
        return prisma.cargoVehicle.findUnique({
            where: { id },
            include: {
                owner: { select: { email: true, vendorProfile: { select: { companyName: true } } } }
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

        return prisma.cargoVehicle.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                owner: { select: { email: true, vendorProfile: { select: { companyName: true } } } }
            }
        });
    }

    async update(id, data) {
        return prisma.cargoVehicle.update({
            where: { id },
            data
        });
    }

    async updateLoad(id, addedWeight, addedVolume) {
        return prisma.cargoVehicle.update({
            where: { id },
            data: {
                currentLoadWeight: { increment: addedWeight },
                currentLoadVolume: { increment: addedVolume }
            }
        });
    }

    async delete(id) {
        return prisma.cargoVehicle.delete({
            where: { id }
        });
    }
}

export const cargoVehicleRepository = new CargoVehicleRepository();
