import prisma from '../../../../config/db.js';
import crypto from 'crypto';

class VehicleRepository {
    async create(data) {
        const { images, ...rest } = data;
        return prisma.vehicle.create({
            data: {
                id: crypto.randomUUID(),
                ...rest,
                images: images ? JSON.stringify(images) : null,
                updatedAt: new Date()
            },
        });
    }

    async findById(id) {
        const vehicle = await prisma.vehicle.findUnique({
            where: { id },
            include: {
                driverprofile: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true
                    }
                }
            }
        });
        if (!vehicle) return null;
        return {
            ...vehicle,
            images: vehicle.images ? (typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images) : []
        };
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
                driverprofile: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        const mappedVehicles = vehicles.map(v => ({
            ...v,
            images: v.images ? (typeof v.images === 'string' ? JSON.parse(v.images) : v.images) : []
        }));

        return { count, vehicles: mappedVehicles };
    }

    async update(id, data) {
        const { images, ...rest } = data;
        const updateData = { ...rest, updatedAt: new Date() };
        if (images) updateData.images = JSON.stringify(images);

        return prisma.vehicle.update({
            where: { id },
            data: updateData,
        });
    }

    async delete(id) {
        return prisma.vehicle.delete({
            where: { id },
        });
    }
}

export const vehicleRepository = new VehicleRepository();
