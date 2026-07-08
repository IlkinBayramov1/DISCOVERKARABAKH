import prisma from '../../../config/db.js';

class DriverRepository {
    async create(data) {
        return prisma.driverprofile.create({
            data,
        });
    }

    async findByUserId(userId) {
        return prisma.driverprofile.findUnique({
            where: { userId },
            include: {
                user_driverprofile_userIdTouser: { select: { email: true } },
                user_driverprofile_managedByIdTouser: { select: { vendorprofile: { select: { companyName: true } } } },
                vehicle: true
            }
        });
    }

    async findById(id) {
        return prisma.driverprofile.findUnique({
            where: { id },
            include: {
                user_driverprofile_userIdTouser: { select: { email: true } },
                user_driverprofile_managedByIdTouser: { select: { vendorprofile: { select: { companyName: true } } } },
                vehicle: true
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

        const count = await prisma.driverprofile.count({ where });
        const drivers = await prisma.driverprofile.findMany({
            where,
            skip,
            take,
            orderBy: { id: 'desc' }, // or createdAt if available
            include: {
                user_driverprofile_userIdTouser: { select: { email: true } },
                user_driverprofile_managedByIdTouser: { select: { vendorprofile: { select: { companyName: true } } } },
                vehicle: { select: { brand: true, model: true, plateNumber: true } },
                cargovehicle: { select: { brand: true, model: true, licensePlate: true } }
            }
        });

        return { count, drivers };
    }

    async update(id, data) {
        return prisma.driverprofile.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return prisma.driverprofile.delete({
            where: { id },
        });
    }
}

export const driverRepository = new DriverRepository();
