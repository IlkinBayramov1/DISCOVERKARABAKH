import prisma from '../../../config/db.js';

class DriverRepository {
    async create(data) {
        return prisma.driverProfile.create({
            data,
        });
    }

    async findByUserId(userId) {
        return prisma.driverProfile.findUnique({
            where: { userId },
            include: {
                user: { select: { email: true } },
                managedBy: { select: { vendorProfile: { select: { companyName: true } } } },
                currentVehicle: true
            }
        });
    }

    async findById(id) {
        return prisma.driverProfile.findUnique({
            where: { id },
            include: {
                user: { select: { email: true } },
                managedBy: { select: { vendorProfile: { select: { companyName: true } } } },
                currentVehicle: true
            }
        });
    }

    async findAll(filter = {}, skip = 0, take = 10) {
        const where = {};
        if (filter.managedById) where.managedById = filter.managedById;
        if (filter.status) where.status = filter.status;
        if (filter.search) {
            where.OR = [
                { firstName: { contains: filter.search } },
                { lastName: { contains: filter.search } },
                { phone: { contains: filter.search } }
            ];
        }

        const count = await prisma.driverProfile.count({ where });
        const drivers = await prisma.driverProfile.findMany({
            where,
            skip,
            take,
            orderBy: { id: 'desc' }, // or createdAt if available
            include: {
                user: { select: { email: true } },
                currentVehicle: { select: { brand: true, model: true, plateNumber: true } }
            }
        });

        return { count, drivers };
    }

    async update(id, data) {
        return prisma.driverProfile.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return prisma.driverProfile.delete({
            where: { id },
        });
    }
}

export const driverRepository = new DriverRepository();
