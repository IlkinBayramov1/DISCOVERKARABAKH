import prisma from '../../../../config/db.js';

class ShipmentRepository {
    async createShipment(data, pricingData) {
        // Atomically create shipment + pricing snapshot
        return prisma.shipment.create({
            data: {
                ...data,
                pricing: {
                    create: pricingData
                }
            },
            include: {
                pricing: true,
                cargoVehicle: true
            }
        });
    }

    async findById(id) {
        return prisma.shipment.findUnique({
            where: { id },
            include: {
                pricing: true,
                cargoVehicle: { select: { brand: true, model: true, licensePlate: true, status: true } },
                driver: { select: { firstName: true, lastName: true, phone: true } },
                sender: { select: { email: true, firstName: true, lastName: true, phone: true } }
            }
        });
    }

    async findByIdempotencyKey(key) {
        return prisma.shipment.findUnique({
            where: { idempotencyKey: key },
            include: { pricing: true }
        });
    }

    async findAll(filter = {}, skip = 0, take = 50) {
        const where = {};
        if (filter.status) where.status = filter.status;
        if (filter.senderId) where.senderId = filter.senderId;

        const count = await prisma.shipment.count({ where });
        const shipments = await prisma.shipment.findMany({
            where,
            skip: Number(skip),
            take: Number(take),
            orderBy: { createdAt: 'desc' },
            include: {
                cargoVehicle: { select: { brand: true, model: true, licensePlate: true } },
                driver: { select: { firstName: true, lastName: true } },
                sender: { select: { email: true, firstName: true, lastName: true, phone: true } }
            }
        });

        return { count, shipments };
    }

    async updateStatus(id, status, extraData = {}) {
        return prisma.shipment.update({
            where: { id },
            data: { status, ...extraData }
        });
    }
}

export const shipmentRepository = new ShipmentRepository();
