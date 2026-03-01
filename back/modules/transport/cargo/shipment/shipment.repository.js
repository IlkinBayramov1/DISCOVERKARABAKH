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
                sender: { select: { email: true } }
            }
        });
    }

    async findByIdempotencyKey(key) {
        return prisma.shipment.findUnique({
            where: { idempotencyKey: key },
            include: { pricing: true }
        });
    }

    async updateStatus(id, status, extraData = {}) {
        return prisma.shipment.update({
            where: { id },
            data: { status, ...extraData }
        });
    }
}

export const shipmentRepository = new ShipmentRepository();
