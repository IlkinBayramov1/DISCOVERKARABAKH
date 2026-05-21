import prisma from '../../../../config/db.js';

class ShipmentRepository {
    async createShipment(data, pricingData) {
        // Atomically create shipment + pricing snapshot
        return prisma.shipment.create({
            data: {
                ...data,
                shipmentpricing: {
                    create: pricingData
                }
            },
            include: {
                shipmentpricing: true,
                cargovehicle: true
            }
        });
    }

    async findById(id) {
        return prisma.shipment.findUnique({
            where: { id },
            include: {
                shipmentpricing: true,
                cargovehicle: { select: { brand: true, model: true, licensePlate: true, status: true } },
                driverprofile: { select: { firstName: true, lastName: true, phone: true } },
                user: { select: { email: true, firstName: true, lastName: true, phone: true } }
            }
        });
    }

    async findByIdempotencyKey(key) {
        return prisma.shipment.findUnique({
            where: { idempotencyKey: key },
            include: { shipmentpricing: true }
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
                cargovehicle: { select: { brand: true, model: true, licensePlate: true } },
                driverprofile: { select: { firstName: true, lastName: true } },
                user: { select: { email: true, firstName: true, lastName: true, phone: true } }
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
