import prisma from '../../../../config/db.js';

class VehicleRepository {
    async create(data) {
        return prisma.vehicle.create({
            data,
        });
    }

    async findById(id) {
        return prisma.vehicle.findUnique({
            where: { id },
            include: {
                currentDriver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true
                    }
                }
            }
        });
    }

    async findAll(filter = {}, skip = 0, take = 10) {
        const where = {};
        if (filter.vendorId) where.vendorId = filter.vendorId;
        if (filter.category) where.category = filter.category;
        if (filter.status) where.status = filter.status;
        if (filter.search) {
            where.OR = [
                { brand: { contains: filter.search } },
                { model: { contains: filter.search } },
                { plateNumber: { contains: filter.search } }
            ];
        }

        const count = await prisma.vehicle.count({ where });
        const vehicles = await prisma.vehicle.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                currentDriver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        return { count, vehicles };
    }

    async update(id, data) {
        return prisma.vehicle.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return prisma.vehicle.delete({
            where: { id },
        });
    }
}

export const vehicleRepository = new VehicleRepository();
